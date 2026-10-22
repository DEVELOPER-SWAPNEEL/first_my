# Connected container milestone — 2026-10-14

AI-assisted implementation and verification. Learner understanding remains unassessed. Raw credentials, dataset contents, backups, manifests and drill reports remain ignored; only sanitized observations are recorded here.

## Runtime and isolation

At assessment the host had7.3GiB free and no running Docker engine/Colima instance. Previous profile configuration existed, but its VM creation had failed from disk exhaustion. Existing tools successfully created/started that profile with smaller settings: Colima0.10.3, VZ/aarch64,2CPU/4GiB RAM/8GiB disks, workspace-only mount, `--activate=false`. Docker client29.9.0/server29.5.2, Compose5.6.0. No reset, deletion of existing resources, host software installation or default-context switch occurred. Later disk headroom was about1.1GiB, so the footprint is viable but constrained.

Native app:8000 and PostgreSQL:55432 were already stopped. Their data was not modified. The connected project `launchops-local` runs on loopback8080; monitoring3000/9090/9093 and Caddy8443. PostgreSQL5432 and exporter9187 are only exposed inside the Compose network. Main backup/status paths are separate from native paths. Private environment files are mode600 and initialization preserves them.

## Startup and actual integration

`python3 scripts/compose.py build` successfully built `launchops:local` from Python3.14.7-slim using the existing classic builder. Runtime/client PostgreSQL17.11 versions matched. The VM pulled the specified images and the app started as UID10001. Database health preceded explicit schema migration (exit0), then app startup. Service DNS, credentials, mounts, permissions and database readiness worked in practice. No migration dropped/recreated existing data.

The connected monitoring images were Prometheus3.15.0, Grafana13.2.4, Alertmanager0.34.1 and PostgreSQL exporter0.20.1; Caddy2.11.7-alpine. All three Prometheus targets (`launchops`,`postgres`,`prometheus`) reported up. Grafana's DB was healthy, Prometheus data source health was OK, and dashboard UID `launchops` contained the intended six panels. Five runtime rules evaluated with health OK.

A real create/retrieve/update verification passed. Three more successful creates changed the Prometheus POST/tickets/201 counter from1 to4 on a subsequent scrape. Title/description/status edits and filtering passed through the container API. Browser created ticket5, inspected and edited all supported fields, filtered to resolved, and backend retrieval confirmed persistence. Mobile390×844 had no horizontal overflow; dialog/Escape and normal console checks passed. Frontend files/design were preserved. After app recreation, an explicitly fresh scrape and a new GET ticket metric were observed; this check avoids treating an old cached target-up result as proof.

Captured last200 logs for eight services contained neither of the configured runtime passwords. App logs retained normalized route, request ID, duration and release context. Caddy's actual internal certificate passed normal hostname/CA verification via a process-specific exported CA; no global trust change, `--insecure`, or browser bypass. Public HTTPS remains unverified.

## Database failure, alerts and persistence

Controlled target: only the task-owned main DB container, with synthetic records and retained named volume. Recovery always attempted even if observation failed. During stop: `/health/live`200, `/health/ready`503, `/tickets`503. The app container ID stayed unchanged and the browser displayed storage unavailable.

`LaunchOpsDatabaseUnavailable` fired after75.277s (15s scrape/evaluation,1m pending period), and local Alertmanager received it. After DB restart, readiness was observed healthy after3.025s; the Prometheus alert cleared after12.028s and Alertmanager no longer reported it. These are observed waits/polling intervals, not an RTO promise. No external notification destination was configured or exercised.

DB and app were then **recreated**, not merely restarted. IDs changed; four committed ticket records were identical afterward and the named volume remained. Fresh post-recreation scraping/request metrics were confirmed. All active alerts were empty at the final check. Raw sanitized phases are in ignored `runtime/container-failure-evidence.json`.

## Container-based fresh-target restore

The reproducible `compose.py drill` used uniquely named projects and the same Compose source. Each seeded3 uniquely identifiable synthetic tickets, changed one before a snapshot-consistent custom dump, and restored a separately named empty DB in a separate volume. The restore compared complete public-table schema/data hashes and probed real constraints. All3 tickets matched through the recovered app; a new ticket verified the restored sequence and write path.

| Run | Backup | Restore | Whole drill |
|---|---:|---:|---:|
| 22:15–22:15 IST |0.052s|0.068s|43.784s|
| Repeat after cleanup fix |0.084s|0.069s|44.135s|

Backup/restore timings come from the actual tools; restore includes checksum, empty-target checks, pg_restore, complete manifest comparison and constraints. Whole drill includes isolated container startup, API seed/verification and failure checks; excludes image build/pull and final cleanup. Small local samples establish no RTO/RPO or S3 recovery claim.

Corrupt archives were rejected by SHA256 and occupied targets by the empty-target guard. Recovered records were unchanged after both failures. No main/native DB was restored over. A first cleanup exposed that plain `down` omitted recovery-profile containers; enabling ops/recovery profiles fixed it. The helper now checks that **no project containers remain**, and the repeat verified this workflow. Every project/drill volume and raw artifact was retained. No volume prune/removal or VM reset was used.

## Verification boundaries and next gate

Current tests29 passed,1 native-only integration skipped. Compose config, Python compile and private ignore rules were checked. These checks supplement the runtime evidence above. Commands and entry points are in README. The single learner exercise is unchanged.

Connected local Compose/observability/recovery implementation gate passes. Remaining Release1 gates include actual AWS host/IAM/state bootstrap, GitHub/OIDC/ECR scanning/immutable delivery, S3 upload/download/fresh restore, bad-release/cloud rollback, host-loss/load evidence, external notifications where authorized, public access/domain/certificate decisions and usability/understanding. See CLOUD_EXECUTION_PLAN.md; preparation is authorized, execution is not.

Official command/config references checked: [Colima commands](https://colima.run/docs/commands/), [profiles](https://colima.run/docs/profiles/), [Docker Compose up/recreation](https://docs.docker.com/reference/cli/docker/compose/up/), [volume persistence](https://docs.docker.com/engine/storage/volumes/).

Final disk check: approximately 900 MiB free on the host. No deletion was performed; further image pulls/builds may require additional space.
