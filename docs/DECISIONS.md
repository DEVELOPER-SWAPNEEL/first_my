# Decisions

## 2026-10-14: incremental implementation

Accepted: implement the first local milestone in response to the explicit request to build. Preserve the supplied learning intent through honest assistance records and a verification exercise. Do not start Release 2 before Release 1 completion.

## 2026-10-14: local SQLite development, PostgreSQL runtime

Accepted: SQLite allows HTTP and persistence checks on the current Mac without Docker. PostgreSQL remains the intended Compose/cloud database. Trade-off: SQLite tests are not PostgreSQL evidence; runtime verification is pending.

## 2026-10-14: dependency control and sources

Runtime and development requirements freeze versions actually installed; Python 3.14.7 was tested on Darwin arm64. Docker base and PostgreSQL tags remain to be pull-verified and converted to immutable digests before release delivery.

Official references consulted: https://fastapi.tiangolo.com/tutorial/sql-databases/ ; https://fastapi.tiangolo.com/advanced/events/ ; https://docs.docker.com/compose/how-tos/startup-order/ . Application initialization uses lifespan; Compose waits for database health. No cloud pricing or authentication claims have been verified yet.

## 2026-10-14: coherent Release 1 prototype and private delivery

Accepted for prototype: explicit additive schema version1, native PostgreSQL evidence while container VM blocked by disk, scoped loopback access, immutable ECR application digests and deterministic source bundles through a protected manual OIDC/SSM workflow. Backup artifacts stay separate from release directories; app reads only sanitized status. Image rollback requires schema compatibility and is separate from a data restore. All code AI-assisted; understanding gates remain open.

Accepted: pg_dump custom format and shared repeatable-read snapshot for matching row manifests; restore only into a differently named, empty target, validate checksum/schema/data and actual constraints. Native drills passed; S3/cloud gates pending. Runtime versions and sources are recorded in infrastructure/delivery/observability runbooks. No Release2 work or cloud provisioning was performed.
