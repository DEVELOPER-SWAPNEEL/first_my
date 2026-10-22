#!/usr/bin/env python3
"""Bounded, read-only LaunchOps diagnostics. Prints evidence, never database data."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import socket
import sys
import time
from urllib.error import HTTPError
from urllib.parse import urlsplit
import urllib.request


def http_json(url, timeout):
    with urllib.request.urlopen(url, timeout=timeout) as response:
        if response.headers.get_content_type() != "application/json":
            raise ValueError("Expected JSON response")
        return json.load(response)


def diagnose(url="http://127.0.0.1:8000", expected_version=None, hostname=None,
             backup_status=None, max_backup_age=86400, timeout=3, require_backup=False):
    parsed = urlsplit(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise ValueError("URL must use http or https")
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise ValueError("URL must not contain credentials, query parameters or fragments")
    if parsed.scheme == "http" and parsed.hostname not in ("localhost", "127.0.0.1", "::1"):
        raise ValueError("Unencrypted diagnostics are restricted to loopback")
    checks = []

    def add(name, status, detail, elapsed=None):
        item = {"check": name, "status": status, "detail": detail}
        if elapsed is not None:
            item["elapsed_seconds"] = round(elapsed, 3)
        checks.append(item)

    if hostname:
        start = time.monotonic()
        try:
            # UDP DNS resolvers can block beyond socket defaults. Run resolution in
            # a bounded child process so doctor always terminates predictably.
            import subprocess
            result = subprocess.run([sys.executable, "-c", "import socket,sys; socket.getaddrinfo(sys.argv[1],None)", hostname],
                                    timeout=timeout, capture_output=True)
            add("dns", "passed" if result.returncode == 0 else "failed",
                "hostname resolves" if result.returncode == 0 else "hostname does not resolve",
                time.monotonic() - start)
        except subprocess.TimeoutExpired:
            add("dns", "failed", "resolution timed out", time.monotonic() - start)
    else:
        add("dns", "skipped", "No --hostname supplied; loopback needs no DNS")
    add("https", "skipped" if parsed.scheme == "http" else "pending",
        "Local HTTP lab; HTTPS not checked" if parsed.scheme == "http" else "Certificate validation uses system trust")
    endpoints = (("liveness", "/health/live", "alive"),
                 ("readiness", "/health/ready", "ready"),
                 ("version", "/version", None))
    for name, path, expected_status in endpoints:
        start = time.monotonic()
        try:
            payload = http_json(url.rstrip("/") + path, timeout)
            if not isinstance(payload, dict):
                raise ValueError("JSON object required")
            if expected_status and payload.get("status") != expected_status:
                raise ValueError("Unexpected health status")
            if name == "version":
                version = payload.get("version")
                if not isinstance(version, str) or not version:
                    raise ValueError("Missing version")
                if expected_version and version != expected_version:
                    add(name, "failed", "Version differs from expected release", time.monotonic() - start)
                    continue
                detail = "Expected release confirmed" if expected_version else "Version endpoint responds; no expected release supplied"
            else:
                detail = "Application process responds" if name == "liveness" else "Database and required schema are ready"
            add(name, "passed", detail, time.monotonic() - start)
            if parsed.scheme == "https":
                checks[1]["status"] = "passed"
                checks[1]["detail"] = "HTTPS request passed certificate and hostname validation"
        except HTTPError as exc:
            add(name, "failed", f"HTTP {exc.code}", time.monotonic() - start)
        except (OSError, ValueError, TypeError):
            add(name, "failed", "Connection, certificate, timeout or response validation failed", time.monotonic() - start)
    if parsed.scheme == "https" and checks[1]["status"] == "pending":
        checks[1]["status"] = "failed"
        checks[1]["detail"] = "No HTTPS request completed successfully"

    if not backup_status:
        add("backup", "failed" if require_backup else "skipped", "No --backup-status supplied")
    else:
        try:
            metadata = json.loads(Path(backup_status).read_text())
            last_success = metadata.get("completed_at_unix")
            if isinstance(last_success, bool) or not isinstance(last_success, (int, float)):
                raise ValueError("Missing backup timestamp")
            age = datetime.now(timezone.utc).timestamp() - last_success
            if age < -60:
                raise ValueError("Backup timestamp is in the future")
            if metadata.get("status") != "success":
                add("backup", "failed", "Last backup attempt failed; retained success does not prove current health")
            elif age > max_backup_age:
                add("backup", "failed", f"Backup is stale: age {int(age)} seconds exceeds {max_backup_age}")
            else:
                add("backup", "passed", f"Local backup success metadata is {max(0, int(age))} seconds old; restore and S3 checks are separate")
        except (OSError, ValueError, TypeError):
            add("backup", "failed", "Backup status is missing or invalid")
    return {"checked_at": datetime.now(timezone.utc).isoformat(), "result": "failed" if any(
        item["status"] == "failed" for item in checks) else "passed", "checks": checks}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:8000")
    parser.add_argument("--expected-version")
    parser.add_argument("--hostname")
    parser.add_argument("--backup-status")
    parser.add_argument("--require-backup", action="store_true")
    parser.add_argument("--max-backup-age", type=int, default=86400, help="seconds; default 24 hours")
    parser.add_argument("--timeout", type=float, default=3)
    args = parser.parse_args()
    if args.timeout <= 0 or args.timeout > 30 or args.max_backup_age <= 0:
        parser.error("timeout must be in (0,30]; max-backup-age must be positive")
    try:
        result = diagnose(**vars(args))
    except ValueError as exc:
        print(json.dumps({"result": "failed", "error": str(exc)}))
        return 2
    print(json.dumps(result, indent=2))
    return 0 if result["result"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
