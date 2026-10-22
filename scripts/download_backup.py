"""Download an explicitly selected S3 backup, then validate its integrity. AI-assisted."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

try:
    from .recovery_common import RecoveryError, private_directory, validate_archive
except ImportError:
    from recovery_common import RecoveryError, private_directory, validate_archive


def download(archive_uri, destination):
    if not re.fullmatch(r"s3://[a-z0-9][a-z0-9.-]+/[A-Za-z0-9_./-]+\.dump", archive_uri):
        raise RecoveryError("Select an explicit s3://bucket/backups/launchops-ID.dump object")
    directory = private_directory(destination)
    archive = directory / archive_uri.rsplit("/", 1)[-1]
    manifest = archive.with_suffix(".json")
    if archive.exists() or manifest.exists():
        raise RecoveryError("Refusing to overwrite an existing local backup; choose a fresh output directory")
    try:
        for uri, target in ((archive_uri, archive), (archive_uri[:-5] + ".json", manifest)):
            target.touch(mode=0o600, exist_ok=False)
            subprocess.run(["aws", "s3", "cp", uri, str(target), "--checksum-mode", "ENABLED", "--only-show-errors"],
                           check=True, capture_output=True, text=True)
            target.chmod(0o600)
        metadata = json.loads(manifest.read_text())
        validate_archive(archive, metadata)
    except Exception:
        archive.unlink(missing_ok=True)
        manifest.unlink(missing_ok=True)
        raise
    return {"status": "integrity_verified", "archive": str(archive), "manifest": str(manifest),
            "restoration_verified": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive_uri")
    parser.add_argument("--output-dir", default="backups/downloaded")
    args = parser.parse_args()
    try:
        print(json.dumps(download(args.archive_uri, Path(args.output_dir)), sort_keys=True))
        return 0
    except FileNotFoundError:
        print(json.dumps({"status": "failed", "error": "S3 download requires AWS CLI v2"}), file=sys.stderr)
        return 1
    except (RecoveryError, OSError, ValueError, subprocess.CalledProcessError) as error:
        print(json.dumps({"status": "failed", "error": str(error).splitlines()[0][:200]}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
