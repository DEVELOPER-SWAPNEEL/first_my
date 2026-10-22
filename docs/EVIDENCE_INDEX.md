# Evidence index — current prototype

| Evidence | Actually observed | Boundary |
|---|---|---|
| [Test output](test-results.txt) | 27 passed, including isolated PostgreSQL test | Python3.14.7/macOS arm64/PG17.11; TEST_POSTGRES_DSN supplied privately |
| [Failure/recovery record](DRILLS.md) | Physical DB outage, validation/backup failure, persistence, two fresh-target restores | Tiny synthetic native lab; excludes Docker/cloud/S3 |
| [Recovery runbook](RECOVERY.md) | Snapshot dump/hash/schema/constraint and recovered API verification | Raw dump/manifest/reports remain ignored in backups/ |
| [UI reference/QA](UI_REFERENCE.md), [preview](prototype-desktop.png) | Browser create/inspect/edit/filter, loading/empty/outage, desktop/mobile, keyboard focus/Escape, motion pause | OS reduced-motion emulation unavailable; exact Framer renderer not asserted |
| [Infrastructure](INFRASTRUCTURE.md) | Terraform fmt, AWS/state validation, five mocked tests, bootstrap syntax | No AWS plan/provisioning/IAM runtime validation |
| [Delivery](DELIVERY.md) | actionlint, embedded Python/shell syntax, controller/doctor/scan-gate tests | No GitHub execution, registry publication, ECR scanning or actual digest rollback |
| [Observability](OBSERVABILITY.md) | Actual app metrics; promtool/amtool config and controlled-series rules pass | No live monitoring containers or external notification |
| Doctor | Actual process/schema/version/local backup checks passed | DNS/HTTPS explicitly skipped; local summary does not prove S3/restore |

Prototype source is AI-assisted. Learner capability remains unassessed. Secrets/state/DB contents/raw chat and backup data are excluded from Git; provider locks and sanitized technical results are source artifacts. No cloud/public deployment or remote push occurred.

## Connected container milestone — 2026-10-14

See [sanitized container evidence](CONTAINER_MILESTONE.md). Image/PG/migration/startup and real container/browser workflows passed. Main DB/app recreation preserved4 committed records; real DB outage/alert/recovery cleared locally. Prometheus3 targets/Grafana6 panels/5 rules passed runtime checks; create counter1→4. Two isolated container restores passed, latest backup0.084s/restore0.069s/full44.135s. Current tests29 pass,1 native-only skipped. No source-only inference used for these runtime claims.

Raw artifacts remain ignored: runtime/container-drill-final.json, runtime/container-failure-evidence.json, runtime/compose-observability.json, runtime/compose-https-evidence.json, runtime/compose-log-safety.json, private UI screenshot runtime/compose-ui.png and backups/compose-drills/. No dataset/credential/manifest contents copied into Git. External notification/S3/cloud behavior remains unverified. [Next cloud plan](CLOUD_EXECUTION_PLAN.md) is prepared only.

Current container milestone test rerun: [container-test-results.txt](container-test-results.txt), 29 passed / 1 native-only integration skipped; Compose config, compileall and Git whitespace check passed.
