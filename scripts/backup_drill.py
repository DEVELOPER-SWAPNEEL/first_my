"""Measured native PostgreSQL recovery drill using only newly created databases.

Requires the development dependencies and a local PostgreSQL role with CREATEDB.
No active ticket database is changed. AI-assisted implementation.
"""
import argparse
import json
import os
from pathlib import Path
import sys
import time
import uuid

import psycopg
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict, make_conninfo
from sqlalchemy import URL
from fastapi.testclient import TestClient

# Executable both as python -m scripts.backup_drill and python scripts/backup_drill.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.main import create_app
from scripts.backup import backup
from scripts.restore import restore
from scripts.recovery_common import RecoveryError, database_dsn, table_manifest, utc_now, write_json


def sqlalchemy_url(dsn):
    config = conninfo_to_dict(dsn)
    return URL.create("postgresql+psycopg", username=config.get("user"), password=config.get("password"),
                      host=config.get("host"), port=int(config.get("port", 5432)), database=config["dbname"])


def drill(admin_dsn, output_dir):
    config = conninfo_to_dict(admin_dsn)
    if config.get("host", "") not in ("127.0.0.1", "localhost", "::1", "/tmp"):
        raise RecoveryError("This automated drill is limited to loopback/native PostgreSQL; never a cloud target")
    identifier = uuid.uuid4().hex[:10]
    source_name, target_name = f"launchops_drill_source_{identifier}", f"launchops_drill_restore_{identifier}"
    source_dsn = make_conninfo(admin_dsn, dbname=source_name)
    target_dsn = make_conninfo(admin_dsn, dbname=target_name)
    created_databases = []
    started = time.monotonic()
    try:
        with psycopg.connect(admin_dsn, autocommit=True) as admin:
            for name in (source_name, target_name):
                admin.execute(sql.SQL("CREATE DATABASE {} TEMPLATE template0").format(sql.Identifier(name)))
                created_databases.append(name)
        with TestClient(create_app(sqlalchemy_url(source_dsn), "recovery-drill", auto_migrate=True)) as client:
            tickets = []
            for title in ("Synthetic restore α", "Synthetic restore β", "Synthetic restore γ"):
                response = client.post("/tickets", json={"title": title, "description": "Generated drill data only"})
                if response.status_code != 201:
                    raise RecoveryError("Synthetic source API creation failed")
                tickets.append(response.json())
            change = client.patch(f"/tickets/{tickets[1]['id']}", json={"status": "resolved", "description": "Updated before backup"})
            if change.status_code != 200:
                raise RecoveryError("Synthetic source update failed")
            tickets[1] = change.json()
        backup_result = backup(source_dsn, output_dir, Path(output_dir).parent / "drill-status" / "latest.json")
        restored = restore(backup_result["archive"], backup_result["manifest"], target_dsn, output_dir)
        with TestClient(create_app(sqlalchemy_url(target_dsn), "restored-drill", auto_migrate=False)) as recovered:
            if recovered.get("/health/ready").status_code != 200:
                raise RecoveryError("Restored application was not ready")
            for ticket in tickets:
                if recovered.get(f"/tickets/{ticket['id']}").json() != ticket:
                    raise RecoveryError("Restored API record differs from synthetic source")
            new = recovered.post("/tickets", json={"title": "Created after recovery"})
            if new.status_code != 201 or new.json()["id"] <= max(t["id"] for t in tickets):
                raise RecoveryError("Restored sequence/write verification failed")
        with psycopg.connect(target_dsn) as target:
            before = table_manifest(target)
        try:
            restore(backup_result["archive"], backup_result["manifest"], target_dsn, output_dir)
        except RecoveryError as error:
            if "target must have no user objects" not in str(error):
                raise
        else:
            raise RecoveryError("Occupied-target guard failed")
        corrupt_dir = Path(output_dir) / "corrupt-drill"
        corrupt_dir.mkdir(mode=0o700)
        corrupt = corrupt_dir / Path(backup_result["archive"]).name
        corrupt.write_bytes(b"corrupt generated drill archive")
        corrupt.chmod(0o600)
        try:
            restore(corrupt, backup_result["manifest"], target_dsn, output_dir)
        except RecoveryError as error:
            if "SHA256 mismatch" not in str(error):
                raise
        else:
            raise RecoveryError("Corrupt-archive guard failed")
        finally:
            corrupt.unlink(missing_ok=True)
            corrupt_dir.rmdir()
        with psycopg.connect(target_dsn) as target:
            if table_manifest(target) != before:
                raise RecoveryError("Failure path modified target data")
        result = {"status": "passed", "completed_at": utc_now(), "synthetic_source_tickets": len(tickets),
                  "restored_tickets_verified_via_api": len(tickets), "post_restore_create_verified": True,
                  "occupied_target_rejected": True, "corrupt_archive_rejected": True,
                  "failure_targets_unchanged": True, "backup_seconds": backup_result["duration_seconds"],
                  "restore_seconds": restored["duration_seconds"],
                  "total_drill_seconds": round(time.monotonic() - started, 3),
                  "measurement": "new source+target DBs, API seed, backup, restore, recovered API, safety failures; excludes cluster provisioning",
                  "cloud_transfer_verified": False, "archive": backup_result["archive"],
                  "restore_report": restored["report"], "created_databases_retained": created_databases}
        write_json(Path(output_dir) / "drill-result.json", result)
        return result
    except Exception:
        # Retain only resources created by this invocation for diagnosis; no implicit drops.
        print(json.dumps({"event": "drill_resources_retained", "databases": created_databases}), file=sys.stderr)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="backups/drill-" + time.strftime("%Y%m%dT%H%M%SZ", time.gmtime()))
    args = parser.parse_args()
    try:
        print(json.dumps(drill(database_dsn(), args.output_dir), sort_keys=True))
        return 0
    except (RecoveryError, psycopg.Error, OSError, ValueError) as error:
        print(json.dumps({"status": "failed", "error": str(error).splitlines()[0][:300]}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
