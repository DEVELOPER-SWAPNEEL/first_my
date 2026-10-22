"""Consequential safety boundaries; the native drill tests real PostgreSQL recovery."""
import hashlib
import json
import os
from pathlib import Path

import pytest

from scripts.recovery_common import RecoveryError, database_dsn, pg_environment, validate_archive
from scripts.restore import restore
from scripts.download_backup import download


def test_corrupted_archive_is_rejected_before_any_target_connection(tmp_path, monkeypatch):
    archive = tmp_path / "backup.dump"
    archive.write_bytes(b"damaged archive")
    manifest = {"format_version": 1, "format": "postgresql-custom", "archive_file": archive.name,
                "archive_sha256": hashlib.sha256(b"original archive").hexdigest(), "tables": {"tickets": {}}}
    metadata = archive.with_suffix(".json")
    metadata.write_text(json.dumps(manifest))
    def connection_forbidden(*args, **kwargs):
        pytest.fail("Integrity failure must be detected before connecting to a target")
    monkeypatch.setattr("scripts.restore.psycopg.connect", connection_forbidden)
    with pytest.raises(RecoveryError, match="SHA256 mismatch"):
        restore(archive, metadata, "dbname=existing_user_data", tmp_path)


def test_sqlite_is_rejected_and_restore_target_is_explicit(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:///local.db")
    with pytest.raises(RecoveryError, match="requires PostgreSQL"):
        database_dsn()
    monkeypatch.delenv("RESTORE_DATABASE_URL", raising=False)
    monkeypatch.delenv("RESTORE_DB_NAME", raising=False)
    with pytest.raises(RecoveryError, match="separate fresh target"):
        database_dsn("RESTORE_")


def test_special_character_password_remains_in_environment(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://user:p%40ss%3Aword%2F%23@localhost:5432/launchops")
    env = pg_environment(database_dsn())
    assert env["PGPASSWORD"] == "p@ss:word/#"
    assert env["PGDATABASE"] == "launchops"
    assert env["PGCONNECT_TIMEOUT"] == "5"


def test_download_never_overwrites_existing_local_backup(tmp_path):
    archive = tmp_path / "launchops-safe.dump"
    archive.write_bytes(b"existing protected backup")
    with pytest.raises(RecoveryError, match="overwrite"):
        download("s3://example-bucket/backups/launchops-safe.dump", tmp_path)
    assert archive.read_bytes() == b"existing protected backup"


def test_s3_input_cannot_be_used_as_cli_argument(tmp_path):
    with pytest.raises(RecoveryError, match="explicit"):
        download("s3://example/backups/backup.dump --endpoint-url=http://attacker", tmp_path)
