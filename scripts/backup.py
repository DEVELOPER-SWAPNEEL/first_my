"""Create a snapshot-consistent custom-format PostgreSQL backup. AI-assisted."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import uuid

import psycopg

try:
    from .recovery_common import (RecoveryError, database_dsn, database_name, private_directory,
                                 run_pg, sha256_file, table_manifest, utc_now, write_json, write_status)
except ImportError:
    from recovery_common import (RecoveryError, database_dsn, database_name, private_directory,
                                 run_pg, sha256_file, table_manifest, utc_now, write_json, write_status)


def upload(archive, manifest_path, destination):
    if not re.fullmatch(r"s3://[a-z0-9][a-z0-9.-]+/[A-Za-z0-9_./-]+", destination):
        raise RecoveryError("BACKUP_S3_URI must be s3://bucket/backups (no credentials or arbitrary shell arguments)")
    for path in (archive, manifest_path):
        try:
            subprocess.run(["aws", "s3", "cp", str(path), destination.rstrip("/") + "/" + path.name,
                            "--sse", "AES256", "--checksum-algorithm", "SHA256", "--only-show-errors"],
                           check=True, capture_output=True, text=True)
        except FileNotFoundError as error:
            raise RecoveryError("S3 upload requires AWS CLI v2") from error
        except subprocess.CalledProcessError as error:
            raise RecoveryError(f"S3 upload failed (exit {error.returncode}); local backup retained") from error


def backup(dsn, output_dir, status_file, s3_uri=None):
    started = time.monotonic()
    destination = private_directory(output_dir)
    identifier = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime()) + "-" + uuid.uuid4().hex[:8]
    archive = destination / f"launchops-{identifier}.dump"
    manifest_path = archive.with_suffix(".json")
    snapshot_at = utc_now()
    # One exported repeatable-read snapshot covers both pg_dump and verification hashes.
    with psycopg.connect(dsn, autocommit=True) as connection:
        connection.execute("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY")
        snapshot = connection.execute("SELECT pg_export_snapshot()").fetchone()[0]
        source_name = database_name(connection)
        tables = table_manifest(connection)
        # Pre-create mode600 so pg_dump never briefly exposes readable contents.
        archive.touch(mode=0o600, exist_ok=False)
        try:
            run_pg("pg_dump", ["--format=custom", "--no-owner", "--no-privileges", "--schema=public",
                               "--snapshot=" + snapshot, "--file=" + str(archive)], dsn)
        except Exception:
            archive.unlink(missing_ok=True)
            raise
        finally:
            connection.execute("ROLLBACK")
    archive.chmod(0o600)
    completed = utc_now()
    manifest = {"format_version": 1, "format": "postgresql-custom", "source_database": source_name,
                "snapshot_at": snapshot_at, "completed_at": completed, "archive_file": archive.name,
                "archive_sha256": sha256_file(archive), "archive_bytes": archive.stat().st_size,
                "tables": tables, "duration_seconds": round(time.monotonic() - started, 3)}
    write_json(manifest_path, manifest)
    status = {"status": "success", "completed_at": completed, "completed_at_unix": time.time(),
              "duration_seconds": manifest["duration_seconds"], "s3_upload_verified": False}
    write_status(status_file, status)
    if s3_uri:
        try:
            upload(archive, manifest_path, s3_uri)
        except RecoveryError:
            status.update(s3_upload_failed=True)
            write_status(status_file, status)
            raise
        status["s3_upload_verified"] = True
        write_status(status_file, status)
    return {"status": "success", "archive": str(archive), "manifest": str(manifest_path),
            "tickets": tables["tickets"]["row_count"], "duration_seconds": manifest["duration_seconds"],
            "s3_upload_verified": status["s3_upload_verified"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default=os.getenv("BACKUP_DIRECTORY", "backups"))
    parser.add_argument("--status-file", default=os.getenv("BACKUP_STATUS_FILE", "runtime/backup-status/latest.json"))
    parser.add_argument("--upload", action="store_true", help="Requires separately authorized AWS write access")
    args = parser.parse_args()
    try:
        if args.upload and not os.getenv("BACKUP_S3_URI"):
            raise RecoveryError("Set BACKUP_S3_URI before an explicitly authorized S3 upload")
        result = backup(database_dsn(), Path(args.output_dir), Path(args.status_file),
                        os.getenv("BACKUP_S3_URI") if args.upload else None)
        print(json.dumps(result, sort_keys=True))
        return 0
    except (RecoveryError, psycopg.Error, OSError, ValueError) as error:
        # Retain prior successful timestamp to make stale-backup signals meaningful.
        previous = {}
        try:
            previous = json.loads(Path(args.status_file).read_text())
        except (OSError, ValueError):
            pass
        previous.update(status="failed", last_attempt_at=utc_now())
        try:
            write_status(args.status_file, previous)
        except OSError:
            pass
        print(json.dumps({"status": "failed", "error": str(error).splitlines()[0][:300]}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
