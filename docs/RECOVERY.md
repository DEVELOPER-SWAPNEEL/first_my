# Backup and fresh-target recovery

AI-assisted implementation. Local PostgreSQL recovery has been exercised; S3 transfer, cloud host loss and externally deployed rollback remain unverified. This workflow protects the active database by requiring a differently named, empty restore target. It never runs `DROP`, `--clean`, or restores over the ticket service.

## Local Compose

Start the normal application first using the README. Backups are on-demand; scheduling and AWS transfers are explicit operator actions.

```sh
docker compose run --rm backup
```

The JSON result gives the archive basename, matching manifest and elapsed time. Dumps use the PostgreSQL custom format and a repeatable-read exported snapshot shared with the complete row hashes. Metadata records source database name, snapshot time, checksum, row counts, column definitions and validated constraint identities. Ticket contents stay in protected dumps, never project records. Directory permissions are 700; dumps/manifests are 600. On Linux these one-shot container artifacts may require the owning user/root to inspect them.

The separately mounted `runtime/backup-status/latest.json` contains only operational timestamps/status. The app reads it for real backup age/failure signals. Failed attempts retain the prior successful time and mark the latest attempt failed. A recent local backup does not establish an S3 copy.

Restore one explicitly selected archive:

```sh
docker compose up -d db-restore
docker compose run --rm restore /backups/launchops-REPLACE_WITH_ACTUAL_ID.dump
docker compose up -d recovered-app
curl --fail http://127.0.0.1:8001/health/ready
curl --fail http://127.0.0.1:8001/tickets
```

`db-restore` has its own `restore_data` volume and database `launchops_restore`. The normal `postgres_data` volume is never mounted by it. Restored app migrations are disabled so readiness depends on the restored schema. The script validates the archive checksum before connecting; refuses source-name, occupied, or concurrently used targets; uses one transactional restore; compares all public-table row hashes/counts and schema; and probes required database validation in rollback-only savepoints. An explicit probe ID avoids advancing the restored sequence.

A PostgreSQL database already contains `public`; restore omits only the archive's public-schema creation entry. PostgreSQL can deparse equivalent CHECK expressions differently, so verification compares constraint identity/type/validation and tests actual ticket constraints rather than comparing textual SQL expressions.

Do not use `docker compose down -v`: it removes active PostgreSQL data. `docker compose down` preserves both volumes. A subsequent drill needs a new empty target, not a second restore over the populated target. Retain successful evidence until reviewed. Any cleanup must name only the separate target created for the drill and must be deliberate; there is no automatic destructive reset command.

## Native PostgreSQL drill

Requires PostgreSQL 17 server/client tools, development Python dependencies, loopback connectivity and a local role with CREATEDB. Set `DATABASE_URL` in your private environment; do not paste credentials into commands or records. If needed, set `PG_BIN` to the PostgreSQL client directory.

```sh
.venv/bin/python -m scripts.backup_drill
```

The drill creates two randomly named databases, migrates only the new source, generates three synthetic tickets through the real API, updates one, backs up, restores the fresh target, checks every recovered API record, then creates another ticket to verify sequence/write behavior. It exercises corrupted-archive and occupied-target rejection and verifies those failures changed no target data. It retains its own databases and ignored backup evidence for diagnosis. The active `launchops` database is not modified.

Native backup and selected restore can also run separately:

```sh
.venv/bin/python -m scripts.backup
# Set RESTORE_DATABASE_URL privately to a pre-created, differently named empty database.
.venv/bin/python -m scripts.restore backups/launchops-REPLACE_WITH_ACTUAL_ID.dump
```

The connection URL can use SQLAlchemy's `postgresql+psycopg` dialect. Passwords go to PostgreSQL subprocess environment variables, never command arguments. SQLite is intentionally rejected by recovery tools.

## Observed evidence — 2026-10-14

Native PostgreSQL 17.11 drill passed: three source tickets recovered exactly through the API, restored creation succeeded, and both safety failures left target data unchanged. Measured backup **0.070 s**, restore **0.060 s**, total drill **0.308 s**. Restore timing includes archive integrity, empty-target checks, `pg_restore`, complete row/schema comparisons and validation probes. Total includes creation of two new databases and API/failure verification, but excludes server provisioning, network transfer and S3. This single small local sample establishes no RTO/RPO guarantee.

Ignored evidence: `backups/drill-20261014T080649Z/drill-result.json` and its restore report. Three preliminary native attempts exposed and fixed public-schema creation and CHECK-expression comparison issues; their generated databases were retained for diagnosis. No existing database was dropped.

Five focused recovery tests passed: corrupt archives rejected before any target connection, SQLite/implicit target rejected, URL password characters safely handled, existing local backup never overwritten by download, and S3 inputs constrained to an explicit object. Compose source parsed successfully; container execution is blocked by insufficient disk space for the local VM image, so container persistence/restore remain unverified.

## S3 preparation and authorization boundary

Terraform supplies a private encrypted backup bucket. The instance role permits transfers under `backups/`; host IMDSv2 credentials are intentionally unavailable to bridge containers. Perform S3 transfers on the host with AWS CLI v2 after a separately authorized cloud operation, using the exact archive and matching `.json` manifest returned by backup. No AWS credentials are baked into images or mounted into the app.

For native environments with configured AWS CLI and database access:

```sh
# BACKUP_S3_URI=s3://your-private-bucket/backups must be set in the private environment.
.venv/bin/python -m scripts.backup --upload
.venv/bin/python -m scripts.download_backup s3://your-private-bucket/backups/launchops-ACTUAL_ID.dump
```

For Compose on AWS, run local `docker compose run --rm backup`, then host-side `aws s3 cp` for each returned archive/manifest with `--sse AES256 --checksum-algorithm SHA256 --only-show-errors`. The application image intentionally does not provide host AWS credentials/CLI. Host copy success alone does not update the local status marker or establish restore success. Download requires AWS CLI v2 and PostgreSQL client tools, validates the AWS checksum and local SHA256, and refuses overwriting an existing local artifact. Supply the downloaded archive to the same fresh-target restore workflow. An S3 restore gate requires that actual upload/download/restore cycle, still pending.

SHA256 catches damage, not malicious replacement of both archive and manifest. Restore only backups from the trusted private bucket/source. PostgreSQL archives execute schema SQL; read-only access to trusted objects and IAM/bucket boundaries matter. No backup contents, metadata, runtime data, state or secrets belong in Git.

Rollback is an application-release operation, separate from data restoration. See the delivery runbook. A rollback must use an earlier image digest whose code supports the current schema; this prototype permits schema version 1 only. Never downgrade a database schema or overwrite live data to make rollback pass.

Implementation follows official [PostgreSQL pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html), [pg_restore](https://www.postgresql.org/docs/17/app-pgrestore.html), [AWS CLI S3 copy/checksums](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html), and [Compose dependency conditions](https://docs.docker.com/compose/how-tos/startup-order/) documentation.

## Container milestone now exercised — 2026-10-14

The earlier VM blocker was resolved safely with available disk and smaller existing-tool configuration. `python3 scripts/compose.py backup` backs the main private container lab; `python3 scripts/compose.py drill` uses a uniquely named isolated project and dynamically available loopback source/restored ports. Both use existing Compose services/tooling. It never restores over main/native data. Two runs passed complete schema/data/constraint and recovered API/new-write checks; see CONTAINER_MILESTONE.md for timings. Profile-aware cleanup removes only unique drill containers/network and verifies none remain; ALL volumes/backups retained. Any later volume deletion requires separate deliberate authorization. S3 remains unverified.
