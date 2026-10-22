# Local failure and recovery evidence — 2026-10-14

Environment: Apple Silicon macOS, Python 3.14.7, native PostgreSQL 17.11 at loopback:55432, FastAPI release `prototype-local` at loopback:8000. All records generated for the lab. AI-assisted implementation/verification; learner capability not assessed.

## Database interruption and backup failure

Hypothesis: stopping the isolated repository database should affect readiness/transactions while the API process remains live. Target: only `runtime/postgres`, created during this run. Data retained; recovery: restart the same cluster. Stop condition: expected HTTP/backup behavior observed, then restore service.

Observed at 09:07:12 UTC (14:37:12 IST): liveness **200** (0.019 s), readiness **503** (0.005 s), ticket list **503** (0.004 s), blank-title submission **422**. Metrics reported `launchops_database_ready 0`. Browser Refresh displayed database unavailable and actual release/backup context.

Backup attempted while the database was stopped exited **1**. Its safe status marker reported failed and retained the previous success timestamp. The UI status endpoint reported that failure without claiming a successful new backup.

Restarting the same cluster restored readiness without restarting the application. The previously edited synthetic ticket retained title/status. A new backup completed successfully. Combined post-start readiness/persistence/backup verification took **0.419 s**; this excludes the database stop/start commands and is not a recovery-time guarantee. Raw sanitized outage results remain in ignored `runtime/outage-evidence.json`.

## Application restart and persistence

The PostgreSQL-backed Uvicorn process was stopped and restarted through `scripts/local.py`. The previously committed synthetic record remained retrievable with its resolved status. Browser created another generated record, inspected it, changed title/description/status, and retrieved it after the later database restart. No volume deletion, data reset or schema downgrade occurred.

## Fresh-target restoration

Two completed native runs recovered three generated tickets into a separately named, initially empty PostgreSQL database, validated complete public-table row hashes/counts/schema and required ticket constraints, retrieved exact records through FastAPI, and made a post-restore create to verify sequence/write behavior.

| Completed run | Backup | Restore | Whole drill |
|---|---:|---:|---:|
| 08:06 UTC | 0.070 s | 0.060 s | 0.308 s |
| 09:13 UTC | 0.090 s | 0.068 s | 0.424 s |

The second run used the documented `scripts/local.py --task drill` wrapper. Total includes new source/target database creation, API seed, snapshot dump, restoration, API checks and safety failures; excludes cluster provisioning, network/S3 transfers and cloud work. Exact timestamps and raw reports are in ignored `backups/drill-*/drill-result.json`. Small local samples are not performance benchmarks or promised RTO/RPO.

Both runs rejected a corrupt generated archive by SHA256 before target changes and rejected restoration into an occupied target. Target hashes remained unchanged after those failures. Initial attempts exposed public-schema creation and equivalent CHECK-expression differences; fixes are documented in RECOVERY.md. Generated failed-run databases were retained for diagnosis; no unrelated database was removed.

## Scope of remaining evidence

Container start/restart/restore could not run because Colima's VM download failed with no space left on device. Compose source passed configuration validation only. Docker images, native live Prometheus/Grafana/Alertmanager, local HTTPS trust, actual notification delivery, ECR scanning, S3 upload/download, cloud host replacement, load bottlenecks and live image rollback are unverified. Release-controller tests check failure handling and recorded release selection using isolated mocked operations; they are not a deployment drill.
