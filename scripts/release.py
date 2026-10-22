"""Private single-host release controller. Never applies Terraform or changes DB data."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
import urllib.request
from urllib.parse import urlsplit

IMAGE = re.compile(r"[a-zA-Z0-9][a-zA-Z0-9./:_-]*@sha256:[0-9a-f]{64}\Z")
VERSION = re.compile(r"[0-9a-f]{40}\Z")


def log(action, **fields):
    print(json.dumps({"action": action, **fields}), flush=True)


def run(command, env=None, capture=False):
    result = subprocess.run(command, env=env, check=True,
                            capture_output=capture, text=True)
    return result.stdout.strip() if capture else ""


def atomic_json(path, payload):
    temporary = path.with_name(path.name + ".tmp")
    descriptor = os.open(temporary, os.O_CREAT | os.O_TRUNC | os.O_WRONLY, 0o600)
    with os.fdopen(descriptor, "w") as stream:
        json.dump(payload, stream, indent=2)
        stream.write("\n")
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)


def validate_release(release, root):
    if not IMAGE.fullmatch(release["image"]) or not VERSION.fullmatch(release["version"]):
        raise ValueError("Release requires a sha256 image digest and a 40 character Git SHA")
    expected = (root / "releases" / release["version"]).resolve()
    if Path(release["release_dir"]).resolve() != expected:
        raise ValueError("Release directory must be ROOT/releases/VERSION")
    for relative in ("compose.yaml", "scripts/verify.py"):
        if not (expected / relative).is_file():
            raise ValueError(f"Release is missing {relative}")


def compose(release, root, *arguments):
    environment = os.environ.copy()
    environment.update(APP_IMAGE=release["image"], APP_VERSION=release["version"])
    command = ["docker", "compose", "--project-name", "launchops", "--env-file",
               str(root / "shared" / ".env"), "--file",
               str(Path(release["release_dir"]) / "compose.yaml")]
    if release.get("monitoring"):
        command += ["--file", str(Path(release["release_dir"]) / "compose.monitoring.yaml")]
    command.extend(arguments)
    return run(command, env=environment)


def registry_login(image):
    registry = image.split("/")[0]
    match = re.fullmatch(r"\d{12}\.dkr\.ecr\.([a-z0-9-]+)\.amazonaws\.com", registry)
    if not match:
        return  # An existing Docker credential configuration serves other registries.
    # Never pass credentials as argv or print them; instance IAM supplies AWS identity.
    password = run(["aws", "ecr", "get-login-password", "--region", match[1]], capture=True)
    subprocess.run(["docker", "login", "--username", "AWS", "--password-stdin", registry],
                   input=password + "\n", text=True, check=True)


def wait_ready(url, version, seconds=90):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url.rstrip("/") + "/health/ready", timeout=3) as response:
                payload = json.load(response)
            if payload.get("status") == "ready" and payload.get("version") == version:
                return
        except (OSError, ValueError):
            pass
        time.sleep(2)
    raise RuntimeError("Application did not become ready at the expected version within 90 seconds")


def activate(release, root, url):
    validate_release(release, root)
    compose(release, root, "config", "--quiet")
    registry_login(release["image"])
    compose(release, root, "pull", "app", "migrate")
    compose(release, root, "up", "-d", "--no-build", "db")
    # Compose waits for database health through migrate's dependency. Only additive
    # migrations are eligible for automatic application rollback.
    compose(release, root, "run", "--rm", "migrate")
    if release.get("monitoring"):
        compose(release, root, "up", "-d", "--no-build")
    else:
        compose(release, root, "up", "-d", "--no-build", "app")
    wait_ready(url, release["version"])
    run([sys.executable, str(Path(release["release_dir"]) / "scripts/verify.py"),
         "--url", url, "--expected-version", release["version"]])


def set_current(root, release):
    link = root / f".current-{os.getpid()}"
    link.symlink_to(Path(release["release_dir"]))
    os.replace(link, root / "current")


def execute(args):
    root = Path(args.root).resolve()
    shared = root / "shared"
    runtime_env = shared / ".env"
    if not runtime_env.is_file():
        raise ValueError("Missing ROOT/shared/.env; create runtime secrets on the host first")
    if runtime_env.stat().st_mode & 0o077:
        raise ValueError("Runtime .env must have no group/other permissions (chmod 600)")
    # Persist backups outside release directories; never let a copied local example
    # silently send each release's backup evidence into a different path.
    settings = {}
    for line in runtime_env.read_text().splitlines():
        key, separator, value = line.partition("=")
        if separator and key.strip() in ("BACKUP_DIRECTORY", "BACKUP_STATUS_DIRECTORY"):
            settings[key.strip()] = value.strip().strip("\"'")
    for key in ("BACKUP_DIRECTORY", "BACKUP_STATUS_DIRECTORY"):
        value = Path(settings.get(key, ""))
        if not value.is_absolute() or not value.resolve().is_relative_to(shared):
            raise ValueError(key + " must be an absolute directory beneath ROOT/shared")
    parsed = urlsplit(args.url)
    if (parsed.scheme not in ("http", "https") or parsed.hostname not in ("127.0.0.1", "localhost", "::1")
            or parsed.username or parsed.password or parsed.query or parsed.fragment):
        raise ValueError("Release verification must use a host-local endpoint without credentials")
    with (shared / ".release.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        record_path = shared / "releases.json"
        record = json.loads(record_path.read_text()) if record_path.exists() else {}
        current = record.get("current")
        if args.mode == "rollback":
            candidate = record.get("previous")
            if not candidate:
                raise ValueError("No previously verified release exists for rollback")
        else:
            candidate = {"image": args.image, "version": args.version,
                         "release_dir": str(Path(args.release_dir).resolve())}
            if getattr(args, "monitoring", False):
                candidate["monitoring"] = True
        validate_release(candidate, root)
        if candidate == current:
            log("already_current", version=candidate["version"])
            return
        start = time.monotonic()
        log(args.mode + "_started", version=candidate["version"])
        try:
            activate(candidate, root, args.url)
        except Exception:
            log("release_failed", version=candidate["version"])
            if current:
                log("automatic_rollback_started", version=current["version"])
                try:
                    activate(current, root, args.url)
                    set_current(root, current)
                    log("automatic_rollback_verified", version=current["version"],
                        elapsed_seconds=round(time.monotonic() - start, 3))
                except Exception:
                    log("automatic_rollback_failed", intervention_required=True)
                    raise
            else:
                # No prior known-good image: stop app; retain the DB and all volumes.
                compose(candidate, root, "stop", "app")
                log("first_release_stopped", intervention_required=True)
            raise
        set_current(root, candidate)
        atomic_json(record_path, {"current": candidate, "previous": current,
                                  "verified_at": datetime.now(timezone.utc).isoformat()})
        log(args.mode + "_verified", version=candidate["version"],
            elapsed_seconds=round(time.monotonic() - start, 3))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=["deploy", "rollback"])
    parser.add_argument("--root", default="/opt/launchops")
    parser.add_argument("--url", default="http://127.0.0.1:8000")
    parser.add_argument("--release-dir")
    parser.add_argument("--image")
    parser.add_argument("--version")
    parser.add_argument("--monitoring", action="store_true", help="Include Compose observability and private HTTPS")
    args = parser.parse_args()
    if args.mode == "deploy" and not all([args.release_dir, args.image, args.version]):
        parser.error("deploy requires --release-dir, --image and --version")
    try:
        execute(args)
    except Exception as exc:
        # Tracebacks or subprocess environment dumps may disclose runtime settings.
        details = {"error_type": type(exc).__name__}
        if isinstance(exc, ValueError):
            details["detail"] = str(exc)
        log("release_error", **details)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
