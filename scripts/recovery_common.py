"""Shared PostgreSQL recovery helpers. AI-assisted implementation.

Database credentials are passed through the subprocess environment, never argv.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
from datetime import datetime, timezone

import psycopg
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict, make_conninfo
from sqlalchemy.engine import make_url


class RecoveryError(RuntimeError):
    pass


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def database_dsn(prefix=""):
    raw = os.getenv(f"{prefix}DATABASE_URL")
    if raw:
        url = make_url(raw)
        if url.get_backend_name() != "postgresql":
            raise RecoveryError("Recovery requires PostgreSQL, not a SQLite development database")
        options = dict(dbname=url.database or "launchops", user=url.username or "launchops",
                       password=url.password or "", host=url.host or "localhost", port=url.port or 5432,
                       connect_timeout=5)
        options.update(dict(url.query))
        return make_conninfo(**options)
    if prefix and not os.getenv(f"{prefix}DB_NAME"):
        raise RecoveryError("Set RESTORE_DATABASE_URL or RESTORE_DB_NAME for the separate fresh target")
    return make_conninfo(
        dbname=os.getenv(f"{prefix}DB_NAME", "launchops"),
        user=os.getenv(f"{prefix}DB_USER", "launchops"),
        password=os.getenv(f"{prefix}DB_PASSWORD", ""),
        host=os.getenv(f"{prefix}DB_HOST", "localhost"),
        port=os.getenv(f"{prefix}DB_PORT", "5432"), connect_timeout=5,
    )


def pg_environment(dsn):
    config = conninfo_to_dict(dsn)
    env = os.environ.copy()
    for option in ("host", "port", "user", "password", "dbname", "sslmode", "connect_timeout"):
        if option in config:
            key = {"dbname": "PGDATABASE", "connect_timeout": "PGCONNECT_TIMEOUT"}.get(option, "PG" + option.upper())
            env[key] = str(config[option])
    return env


def executable(name):
    pg_bin = os.getenv("PG_BIN")
    candidate = str(Path(pg_bin) / name) if pg_bin else shutil.which(name)
    if not candidate or not Path(candidate).is_file():
        raise RecoveryError(f"Missing {name}; install PostgreSQL 17 client tools or use the Compose ops services")
    return candidate


def run_pg(name, arguments, dsn=None):
    result = subprocess.run([executable(name), *arguments], env=pg_environment(dsn) if dsn else None,
                            capture_output=True, text=True)
    if result.returncode:
        detail = result.stderr.strip().splitlines()[-1:] or ["No diagnostic returned"]
        password = conninfo_to_dict(dsn).get("password", "") if dsn else ""
        diagnostic = detail[0].replace(password, "[redacted]") if password else detail[0]
        raise RecoveryError(f"{name} failed (exit {result.returncode}): {diagnostic[:300]}")
    return result.stdout


def sha256_file(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path, payload, mode=0o600):
    path = Path(path)
    temporary = path.with_name(path.name + ".tmp")
    with os.fdopen(os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, mode), "w") as output:
        json.dump(payload, output, indent=2, sort_keys=True)
        output.write("\n")
    temporary.chmod(mode)
    temporary.replace(path)


def private_directory(path):
    path = Path(path)
    path.mkdir(parents=True, exist_ok=True, mode=0o700)
    path.chmod(0o700)
    return path


def write_status(path, payload):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.parent.chmod(0o755)
    write_json(path, payload, 0o644)


def database_name(connection):
    return connection.execute("SELECT current_database()").fetchone()[0]


def table_manifest(connection):
    """Hash complete ordered rows plus schema; metadata contains no ticket content."""
    tables = connection.execute("""SELECT tablename FROM pg_tables
        WHERE schemaname = 'public' ORDER BY tablename""").fetchall()
    if not any(row[0] == "tickets" for row in tables):
        raise RecoveryError("Required tickets table is missing")
    manifest = {}
    for (table,) in tables:
        rows = connection.execute(sql.SQL("SELECT to_jsonb(t)::text FROM public.{} t ORDER BY to_jsonb(t)::text")
                                  .format(sql.Identifier(table)))
        digest, count = hashlib.sha256(), 0
        for (row,) in rows:
            canonical = json.dumps(json.loads(row), sort_keys=True, separators=(",", ":"), ensure_ascii=False)
            digest.update(canonical.encode("utf-8") + b"\n")
            count += 1
        columns = connection.execute("""SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns WHERE table_schema='public' AND table_name=%s
            ORDER BY ordinal_position""", (table,)).fetchall()
        # pg_dump can rewrite equivalent CHECK expressions during deparsing. Compare
        # names/types/validation, then probe required ticket checks during restoration.
        constraints = connection.execute("""SELECT conname, contype, convalidated
            FROM pg_constraint c JOIN pg_class t ON c.conrelid=t.oid
            JOIN pg_namespace n ON n.oid=t.relnamespace
            WHERE n.nspname='public' AND t.relname=%s ORDER BY conname""", (table,)).fetchall()
        manifest[table] = {"row_count": count, "rows_sha256": digest.hexdigest(),
                           "columns": [list(row) for row in columns],
                           "constraints": [list(row) for row in constraints]}
    return manifest


def verify_ticket_constraints(connection):
    """Probe real database checks in rollback-only savepoints using an explicit ID."""
    with connection.transaction():
        verification_id = connection.execute("SELECT COALESCE(MIN(id), 0) - 1 FROM tickets").fetchone()[0]
        cases = [(" ", "", "open"), ("x" * 121, "", "open"),
                 ("validation probe", "x" * 2001, "open"), ("validation probe", "", "invalid")]
        for title, description, status in cases:
            try:
                with connection.transaction():
                    connection.execute("INSERT INTO tickets(id,title,description,status) VALUES (%s,%s,%s,%s)",
                                       (verification_id, title, description, status))
                    raise RecoveryError("Restored ticket database accepted invalid data; required constraint missing")
            except (psycopg.errors.CheckViolation, psycopg.errors.StringDataRightTruncation):
                continue


def assert_fresh_target(connection, source_name):
    target_name = database_name(connection)
    # Require a different name even on a different host: aliases cannot bypass the safety guard.
    if target_name == source_name:
        raise RecoveryError("Refusing restore: target database name equals source; use a separately named fresh target")
    objects = connection.execute("""SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname NOT IN ('pg_catalog','information_schema') AND n.nspname NOT LIKE 'pg_toast%'""").fetchone()[0]
    routines = connection.execute("""SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid
        WHERE n.nspname NOT IN ('pg_catalog','information_schema')""").fetchone()[0]
    sessions = connection.execute("""SELECT count(*) FROM pg_stat_activity
        WHERE datname=current_database() AND pid<>pg_backend_pid()""").fetchone()[0]
    if objects or routines or sessions:
        raise RecoveryError("Refusing restore: target must have no user objects and no other connected sessions")
    return target_name


def validate_archive(path, manifest):
    path = Path(path)
    if manifest.get("format_version") != 1 or manifest.get("format") != "postgresql-custom":
        raise RecoveryError("Unsupported backup manifest format")
    if path.name != manifest.get("archive_file"):
        raise RecoveryError("Archive filename does not match its manifest")
    if sha256_file(path) != manifest.get("archive_sha256"):
        raise RecoveryError("Backup integrity check failed: SHA256 mismatch")
    if "tickets" not in manifest.get("tables", {}):
        raise RecoveryError("Manifest does not describe the required tickets table")
    run_pg("pg_restore", ["--list", str(path)])
