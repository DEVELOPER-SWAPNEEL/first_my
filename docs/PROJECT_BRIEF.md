# Project brief

LaunchOps helps a small team ship a support-ticket application, detect failures and recover services and synthetic data through reproducible procedures.

Learning goals: explain HTTP/persistence, container networking and volumes, cloud ownership and access controls, artifact delivery, failure diagnosis and recovery. Portfolio evidence must distinguish AI assistance from independent work.

Release 1: FastAPI/PostgreSQL/Compose; Terraform networking, compute and separate S3 backup storage; host bootstrap; GitHub Actions tests/build/scan/deploy/transaction verification; immutable registry references; HTTPS and restricted administration; Prometheus/Grafana/Alertmanager with tested notifications; fresh-target restore; rollback, teardown and timed drills.

Release 2: same workload on bounded single-node K3s with Helm and Argo CD. Preserve Release 1 through a tagged milestone. Single-node deployments are not highly available.

Completion gates: behavior and important failure paths verified, reproducible setup, learner explanation, independent variation, saved evidence. No gate is complete solely because files exist.

Constraints: synthetic data, local-first work; time, AWS account, region and budget are unconfirmed. No paid cloud resources authorized. Avoid unnecessary frontend scope.

Non-goals: multi-cloud, multi-region, service meshes, Kafka, Backstage, custom operators, MLOps and automatic remediation.
