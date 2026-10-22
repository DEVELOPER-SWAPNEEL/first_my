# LaunchOps

A private deployment-and-recovery lab around a small FastAPI support-ticket workload. Create a ticket, inspect and edit it, observe real service signals, and prove a backup can be restored into a separate target.

The prototype includes PostgreSQL persistence, explicit schema initialization, the animated WaitlistKit V3-inspired interface, bounded diagnostics, request metrics/logging, and snapshot-consistent backup/fresh-target recovery. Terraform, Compose monitoring/HTTPS and GitHub delivery source are prepared. **Release 1 is not complete:** the connected local container milestone now passes; cloud deployment/S3/cloud rollback, external notification delivery, public access decisions and learner understanding remain pending.

## Run the working native prototype

Tested on macOS arm64 with Python 3.14.7 and PostgreSQL 17.11. PostgreSQL server/client tools must be installed; on this Mac they are at `/opt/homebrew/opt/postgresql@17/bin`. Set `PG_BIN` for another installation. Run from the repository root:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python scripts/local.py
```

Open **http://127.0.0.1:8000**; `/docs` exposes the API. The native server was stopped at the latest assessment; its data remains preserved. The verified container stack serves port 8080 separately. Check port ownership before starting another native instance, or use `--app-port 8002`.

The helper creates only this repository's ignored `runtime/postgres` cluster on loopback port 55432 with its Unix socket in the protected runtime directory, generates a private random password, creates the local `launchops` database if absent, runs an additive migration and starts Uvicorn. It does not use the global Homebrew database service. Ctrl-C stops the app and retains PostgreSQL/data; `scripts/local.py --stop-db` stops only this repository cluster. Restart the helper to resume with the same data. Never delete `runtime/postgres` or its password file as a troubleshooting shortcut.

```sh
.venv/bin/python scripts/verify.py --expected-version prototype-local
.venv/bin/python scripts/doctor.py --expected-version prototype-local
.venv/bin/python scripts/local.py --task backup
.venv/bin/python scripts/doctor.py --expected-version prototype-local \
  --backup-status runtime/backup-status/latest.json --require-backup
.venv/bin/python scripts/local.py --task drill
```

The transaction check leaves a synthetic ticket. Backup creates ignored mode-600 artifacts and a sanitized operational summary. The drill creates two fresh, randomly named databases, seeds generated records, restores and verifies them, and retains its own resources/evidence. It does not overwrite the active application database. See [recovery](docs/RECOVERY.md) before manual restores or cleanup.

SQLite remains a lightweight API/unit-test option: `.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8002`. This is a development fallback and does not prove PostgreSQL/container behavior.

## Verified local Docker Compose stack

The existing stack now runs on the task-owned Colima profile `launchops` and Compose project `launchops-local`. The native prototype and its data remain separate; it was stopped when this session began. **Container application: http://127.0.0.1:8080**. Port8000 remains available for native use.

Installed tools were reused; no host software was installed/replaced or user files/caches/VMs/volumes removed. Colima started with VZ,2 CPUs,4GiB RAM,8GiB data/root disk settings and only this workspace mounted writable. Default Docker context remains unchanged. The classic image builder worked without installing the missing buildx plugin.

From the repository root:

```sh
# Start the existing VM if it is stopped; do not reset/delete it.
colima start launchops --activate=false
python3 scripts/compose.py init
python3 scripts/compose.py config
python3 scripts/compose.py build
python3 scripts/compose.py up
python3 scripts/compose.py ps
python3 scripts/compose.py verify
python3 scripts/compose.py logs
```

The helper uses the existing Compose files, task-owned Docker socket and private plugin configuration. It creates ignored mode600 `runtime/compose.env` only if absent and never replaces saved passwords. Its loopback ports and artifact/status paths can be reviewed there; don't print or paste the password values. Independent child environment handling prevents native settings from contaminating Compose. PostgreSQL is network-private with no host port. Explicit migration runs after database health and before app startup.

Monitoring: Grafana http://127.0.0.1:3000, Prometheus http://127.0.0.1:9090, Alertmanager http://127.0.0.1:9093. Grafana credentials are in private `runtime/compose.env`; anonymous access/signup disabled. The provisioned six-panel dashboard and Prometheus data source were queried successfully. All three Prometheus targets are up. Local alerts reach Alertmanager; its receiver has no external destination, so external delivery is unverified.

Read-only health and real backup/recovery workflows:

```sh
python3 scripts/doctor.py --url http://127.0.0.1:8080 --expected-version compose-local
python3 scripts/compose.py backup
python3 scripts/doctor.py --url http://127.0.0.1:8080 --expected-version compose-local \
  --backup-status runtime/compose-backup-status/latest.json --require-backup
python3 scripts/compose.py drill
```

`drill` creates a uniquely named Compose project using the same app/DB/migration/backup/restore services, generates three synthetic tickets, restores a separate empty target, compares schema/data and recovered API records, tests a new write, and rejects corrupt/occupied targets. It removes only its containers/network after saving evidence; **all volumes and raw artifacts remain retained**. Main and native databases are untouched. Two container drill runs passed; see [container evidence](docs/CONTAINER_MILESTONE.md).

`python3 scripts/compose.py failure-drill` deliberately interrupts this clearly scoped local database, waits for actual Prometheus/Alertmanager transitions, recovers it and recreates app/DB containers with named volumes retained. Run only during a private lab window with no concurrent writes. It is not an ordinary startup command; it can cause brief service unavailability and leaves synthetic records intact.

Private HTTPS at `https://localhost:8443` also passed certificate/hostname verification using Caddy's exported CA in `runtime/compose-caddy-root.crt` with `SSL_CERT_FILE` for that one CLI process. No host trust-store change or browser warning bypass occurred. This is not a publicly trusted certificate. Raw Compose users can export their own current container CA with `docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt <private-path>`; don't reuse another environment's CA.

Safe shutdown:

```sh
python3 scripts/compose.py stop
# Optional: stops only this VM and retains its disks/data.
colima stop launchops
```

The helper never removes volumes. **`docker compose down -v`, volume removal, Docker prune, or Colima delete/reset are destructive and are not normal workflow commands.** Current host disk headroom remains tight; no cleanup was performed to make space. Reuse cached images and obtain approval before any additional installation or removal.

For raw Compose/CI/cloud use, `.env.example` remains a secret-free template. Core defaults stay port8000 and restored8001; optional `APP_PORT`, `RESTORED_APP_PORT` and monitoring port variables avoid conflicts. Raw project names and credentials must remain stable to reuse their own named volume. Changing `.env` does not rotate the password in an initialized DB volume.

## Verification and boundaries

- Current tests:29 passed,1 native PostgreSQL integration skipped because that server was stopped; previous native run passed27 tests. Real container API/persistence/recovery were separately exercised, not inferred from unit tests.
- Real HTTP/browser create, inspect, edit and filter checks passed against PostgreSQL. App/database restart preserved synthetic records. Database outage yielded live 200, readiness/tickets 503, invalid create 422; recovery restored readiness without app restart.
- Fresh-target restore recovered all three generated tickets exactly; a new recovered write worked. Corrupt archives and occupied targets were rejected without changing the target. See [drill evidence](docs/DRILLS.md).
- Prometheus syntax/rules and controlled-series alert tests, Alertmanager configuration, Compose configuration, JavaScript/shell syntax, Terraform formatting/validation and five mocked safety tests passed. Workflow source passed actionlint. Those source checks are distinct from the new real local container evidence; cloud execution remains unverified.

Request logs contain method, normalized route, status, duration, release and request ID; no ticket bodies, query strings or credentials. `/metrics` exposes real request/error/latency, database readiness, release and backup-summary signals. The UI reports local backup completion separately from S3 transfer and does not offer infrastructure/reset controls. Database role separation is still a hardening task: the small lab uses the PostgreSQL initialization role for app/migration/exporter access.

Terraform prepares a single no-ingress AWS host administered through SSM, retained encrypted storage, private S3 backups and immutable ECR. Manual GitHub delivery uses restricted OIDC, an immutable digest, checksum-protected source bundle, ECR basic scan gate, local transaction verification and a previous-release rollback controller. Read [infrastructure](docs/INFRASTRUCTURE.md) and [delivery](docs/DELIVERY.md); no AWS apply, image publication, cloud transfer or GitHub execution occurred. The next reviewable gate is [private cloud execution](docs/CLOUD_EXECUTION_PLAN.md).

The application has no authentication. Keep it private and use synthetic data. One host is not highly available, an image rollback does not roll back data, and tiny local native/container recovery samples establish no RTO/RPO guarantee. Public HTTPS needs access control, domain/DNS/certificate decisions and separate authorization.

Read [current state](docs/STATE.md), [roadmap](docs/ROADMAP.md), [evidence](docs/EVIDENCE_INDEX.md) and the [single learning exercise](docs/FIRST_EXERCISE.md). Implementation is AI-assisted; independent understanding remains unassessed.

Final disk check: approximately 900 MiB free on the host. No deletion was performed; further image pulls/builds may require additional space.


Repository origin: first_my, by Swapneel Purohit.
