# Release 1 delivery and diagnosis

This source is AI-assisted. Local checks and controller tests are evidence of implementation, not learner mastery. Cloud delivery remains unverified until a separately authorized deployment runs.

## Release identity and host layout

The container is tagged with the full 40-character Git commit SHA in an immutable ECR repository. Deployment resolves the tag and runs only `repository@sha256:<digest>`; `APP_VERSION` is that commit SHA. A private S3 object contains an allowlisted configuration/script bundle, with SHA-256 verified on the host before extraction. The source bundle contains no `.env`, database, backup data, Terraform state, or chat history.

```text
/opt/launchops/
  shared/.env                       # host-managed runtime secrets, chmod 600
  shared/releases.json              # verified current/previous image and config
  shared/backups/                   # private backup artifacts; never in Git
  shared/runtime/backup-status/     # sanitized backup summary
  releases/<commit-sha>/            # immutable image's matching runtime source
  current -> releases/<commit-sha>/ # switches only after transaction verification
```

Compose always uses project name `launchops`, so changing the release directory retains the same database volume. Release configs stay in their original directories for rollback. Keep at least the current and previous bundles and ECR images; do not expire the last known-good image.

Before the first deployment, create `/opt/launchops/shared/.env` through a secure host session using the environment example as a guide. Use an alphanumeric random PostgreSQL password; never pass it in a RunCommand parameter or GitHub log. Set `BACKUP_DIRECTORY=/opt/launchops/shared/backups` and `BACKUP_STATUS_DIRECTORY=/opt/launchops/shared/runtime/backup-status`. Configure Grafana credentials if enabling monitoring. Set owner permissions on the private directories and `chmod 600` on `.env`. No cloud runtime secret is needed in the repository or GitHub Actions.

## GitHub configuration and authorization boundary

`.github/workflows/ci.yaml` runs unit/failure-path checks, builds Compose, makes a real PostgreSQL ticket transaction, restarts app/database, and verifies the synthetic ticket persists. A passing run is distinct from having reviewed the infrastructure or approved publication.

`.github/workflows/release.yaml` is **manual only** and has a `release1` environment gate. It performs checks before obtaining short-lived AWS credentials, building/publishing the image, uploading the bundle, and issuing SSM commands. Configure required reviewers and allowed deployment branches on that environment before enabling it. Running this workflow publishes an image and changes AWS; that execution needs explicit authorization, credentials, and provisioned infrastructure. It was not run during this implementation.

Set these repository/environment **variables**, using Terraform outputs:

| Variable | Terraform output |
|---|---|
| `AWS_REGION` | `aws_region` |
| `AWS_ACCOUNT_ID` | `aws_account_id` |
| `AWS_ROLE_ARN` | `github_deploy_role_arn` |
| `ECR_REPOSITORY` | `ecr_repository_name` |
| `DEPLOY_INSTANCE_ID` | `instance_id` |
| `DEPLOY_ARTIFACT_BUCKET` | `backup_bucket_name` |
| `ENABLE_MONITORING` | optional `true` or `false` (default `false`) |

No long-lived AWS access-key secret is configured: the job requests an OIDC token with `id-token: write` and exchanges it for a role session. The trust policy must match the exact repository/environment subject and `sts.amazonaws.com` audience. GitHub's newer repositories may include immutable owner/repository IDs in the subject; inspect the actual subject instead of guessing it. [GitHub OIDC for AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)

The AWS host needs outbound registry/S3/SSM connectivity, the SSM agent, AWS CLI, Docker Compose, and the runtime environment file. The job has no SSH key and makes no inbound/public health request. SSM checks readiness and the transaction on the host's loopback endpoint. RunCommand is eventually consistent, so the workflow polls invocation status within a bounded 15-minute window. [AWS Run Command](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)

ECR login uses `--password-stdin`; the instance role supplies pull credentials and the workflow role supplies push credentials. Registry authorization tokens are temporary. [ECR push authentication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

Actions are pinned to full commit SHAs, inspected against official release metadata on 2026-10-14: checkout 7.0.1, setup-python 7.0.0, configure-aws-credentials 6.3.0. Recheck pins deliberately when upgrading. [Secure use of Actions](https://docs.github.com/en/actions/reference/security/secure-use)

## Deployment behavior and rollback

`deploy.sh` validates a digest reference, complete Git SHA, host-local URL, matching release directory, secret permissions and Compose configuration. It serializes deployment with a file lock, authenticates/pulls the image, starts the database, runs the explicit migration service, starts the application, waits for expected-version readiness, and calls `verify.py` to create/retrieve/resolve a synthetic ticket. This leaves a clearly named synthetic ticket as transaction evidence. Only then does it switch `current` and atomically record release metadata.

A failed candidate returns a nonzero exit code even when automatic rollback succeeds. It reactivates the previously verified **configuration directory and image digest**, then repeats readiness and transaction checks. If the first release fails, it stops the app and retains the database/volumes. If rollback fails, the command reports intervention required. It never deletes volumes or restores over the active database. `ENABLE_MONITORING=true` includes the monitoring/HTTPS Compose override; its Grafana runtime credentials must already be set on the host. Release metadata retains this selection for rollback. Readiness acceptance verifies the application transaction; it does not prove an alert notification or live HTTPS trust setup.

Only additive, backward-compatible migrations are eligible for this application rollback. Rollback does not reverse database schema or erase transactions written after deployment. A destructive/incompatible migration requires a separately reviewed migration/recovery plan. No automatic schema downgrade is provided.

On an authorized host, explicit rollback uses recorded previous release metadata:

```sh
sudo bash /opt/launchops/current/scripts/rollback.sh --root /opt/launchops
```

Alternatively choose `rollback` when manually invoking the protected release workflow. This operation does not build or publish another image. A second successful rollback toggles the current/previous pair, allowing a deliberate return to the other verified image. Controller failure-path tests exercise metadata preservation and selection; they do not prove a real cloud rollback happened.

## Read-only doctor

Run locally while the application is up:

```sh
python3 scripts/doctor.py --expected-version local
python3 scripts/doctor.py --expected-version local \
  --backup-status runtime/backup-status/latest.json --require-backup
```

It returns JSON and exit code 0 for passed required checks, 1 for unhealthy evidence, 2 for invalid command configuration. It independently checks liveness, database/schema readiness and expected release; backup status is checked for successful attempt, valid timestamp and freshness (default 24 hours). A recent local backup summary proves neither S3 transfer nor restoration. Omitted optional prerequisites are marked skipped, not verified.

For separately configured HTTPS, use `--url https://<trusted-hostname> --hostname <trusted-hostname>`; normal system certificate and hostname verification remains enabled. Local internal certificates need a trusted CA (for example `SSL_CERT_FILE`), never a TLS-verification bypass. The DNS child process and every HTTP check have bounded timeouts. Public unencrypted URLs and URL-embedded credentials are rejected.

To diagnose a DB outage, compare `liveness=passed` with `readiness=failed`, then inspect `docker compose ps` and `docker compose logs --tail=100 db app`. Doctor does not read tickets, print runtime secret values, remediate resources, or initiate backups/restores.

## Prototype scan gate and configuration integrity

The manual deploy path now waits for ECR **basic** scanning of the exact digest and fails closed unless scan status is COMPLETE with usable severity counts and zero HIGH/CRITICAL findings. Repository scan-on-push and the required DescribeImageScanFindings permission are prepared; actual scans remain unverified. This covers basic OS vulnerability findings, not application dependency assurance. Unsupported/incomplete/expired scanning requires investigation before deployment, not a bypass. See [AWS scan findings](https://docs.aws.amazon.com/AmazonECR/latest/userguide/describe-scan-findings.html).

Release bundle creation uses deterministic ordering/timestamps/ownership. On-host `.bundle-sha256` preserves its checksum; reusing a commit directory with a different bundle is rejected. The release controller also requires absolute backup/status paths beneath ROOT/shared. CI source includes on-demand backup, isolated target restore and a transaction against recovered-app; it has not run on GitHub.

Manual rollback uses the stored, previously verified release and bypasses candidate build/test jobs; a broken new commit must not prevent recovery. It retains the protected release1 environment approval and host-local verification.
