# Release roadmap and gates

| Milestone | Implementation/evidence | Remaining engineering gate | Understanding gate |
|---|---|---|---|
| 1 — local workload | API/edit/filter/UI; native PostgreSQL transaction, restart, constraints and outage verified | Local Compose implementation gate passed; learning gate remains open | Not assessed; active persisted-transaction exercise |
| 2 — AWS/host | Terraform networking/no ingress, EC2/SSM, retained encrypted storage, ECR/S3/OIDC, state bootstrap; fmt/validate/5 mocked tests pass | Authorized real plan/provision/bootstrap/access and reviewed costs/teardown | Not assessed |
| 3 — delivery/rollback/HTTPS | Manual Actions, immutable digest/source bundle, scan gate, transaction verification/previous-release controller; source/controller checks pass | Real image build/scan/delivery/bad-release rollback; cloud HTTPS certificate/trust and eventual public access-control design (local internal-CA HTTPS verified) | Not assessed |
| 4 — observability/recovery | Actual app metrics/logs/backup summary; Prometheus/Grafana/Alertmanager/exporter config; alert series tests; real native and container fresh-target restore/corruption safeguards | Live local scrape/dashboard/alerts and container restore passed; external notifications/S3/cloud/load/host replacement remain | Not assessed |
| 5 — Release 1 evidence/usability | Compact runbooks, measured local drills, evidence index | Prior gates; another person's reproducible setup and honest case study | Explain mechanisms/trade-offs and independently vary/diagnose |
| 6 — K3s/Helm/Argo CD | Deferred | All Release 1 gates first; preserve tagged Compose milestone when migrating | Not assessed |

This was an explicitly requested AI-assisted implementation run. Passing code checks does not complete learning gates. One active exercise remains in FIRST_EXERCISE.md; no parallel learner assignments. Schedule is provisional, depends on prerequisites and measured progress, and is not a deadline-based completion claim.

2026-10-14: Connected local container implementation milestone verified; see CONTAINER_MILESTONE.md. Next engineering gate is the reviewed private AWS execution plan in CLOUD_EXECUTION_PLAN.md. No cloud execution is authorized. Understanding gates remain Not assessed.
