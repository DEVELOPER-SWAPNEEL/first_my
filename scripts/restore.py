"""Restore and verify a backup only into a separately named, empty target. AI-assisted."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import time

import psycopg

try:
    from .recovery_common import (RecoveryError, assert_fresh_target, database_dsn, private_directory,
                                 run_pg, table_manifest, utc_now, validate_archive, verify_ticket_constraints, write_json)
except ImportError:
    from recovery_common import (RecoveryError, assert_fresh_target, database_dsn, private_directory,
                                 run_pg, table_manifest, utc_now, validate_archive, verify_ticket_constraints, write_json)


def restore(archive, manifest_path, target_dsn, report_dir):
    started = time.monotonic()
    archive, manifest_path = Path(archive), Path(manifest_path)
    manifest = json.loads(manifest_path.read_text())
    validate_archive(archive, manifest)  # Integrity checked before connecting to any target.
    destination = private_directory(report_dir)
    with psycopg.connect(target_dsn, autocommit=True) as connection:
        target_name = assert_fresh_target(connection, manifest["source_database"])
        # Never --clean or --create: no existing object is removed by this workflow.
        # A fresh PostgreSQL database already has public; omit only its CREATE SCHEMA entry.
        contents = run_pg("pg_restore", ["--list", str(archive)])
        selected = "\n".join(line for line in contents.splitlines()
                             if not re.match(r"^\d+;\s+\d+\s+\d+\s+SCHEMA\s+-\s+public\s", line)) + "\n"
        with tempfile.NamedTemporaryFile(mode="w", dir=destination, suffix=".restore-list") as listing:
            listing.write(selected)
            listing.flush()
            run_pg("pg_restore", ["--dbname=" + target_name, "--no-owner", "--no-privileges", "--single-transaction",
                                  "--exit-on-error", "--use-list=" + listing.name, str(archive)], target_dsn)
        actual = table_manifest(connection)
        if actual != manifest["tables"]:
            raise RecoveryError("Restore completed but table data/schema verification failed; isolate target for review")
        verify_ticket_constraints(connection)
    duration = round(time.monotonic() - started, 3)
    report = {"status": "verified", "source_database": manifest["source_database"],
              "target_database": target_name, "archive_file": archive.name,
              "archive_sha256": manifest["archive_sha256"], "snapshot_at": manifest["snapshot_at"],
              "completed_at": utc_now(), "duration_seconds": duration,
              "ticket_count": actual["tickets"]["row_count"], "verified_tables": sorted(actual),
              "ticket_constraints_verified": True,
              "measurement": "archive integrity + empty-target check + pg_restore + complete data/schema hash comparison"}
    report_path = destination / f"restore-{archive.stem}.json"
    write_json(report_path, report)
    return {**report, "report": str(report_path)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--report-dir", default=os.getenv("BACKUP_DIRECTORY", "backups"))
    args = parser.parse_args()
    try:
        result = restore(args.archive, args.manifest or args.archive.with_suffix(".json"),
                         database_dsn("RESTORE_"), args.report_dir)
        print(json.dumps(result, sort_keys=True))
        return 0
    except (RecoveryError, psycopg.Error, OSError, ValueError, KeyError) as error:
        print(json.dumps({"status": "failed", "error": str(error).splitlines()[0][:300]}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
