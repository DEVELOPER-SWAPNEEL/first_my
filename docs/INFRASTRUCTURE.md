# Release 1 infrastructure

This source is AI-assisted and locally checked. No AWS resources were provisioned, no cloud plan was run, and no HTTPS service or IAM policy was exercised on AWS. The source prepares one private-by-access lab; account, region, budget, repository and operator authorization are still prerequisites.

## Architecture and boundaries

`infra/aws` creates one Ubuntu 24.04 amd64 EC2 host, its VPC/subnet/Internet Gateway, a private ECR repository, and one private S3 bucket with separate `backups/` and `releases/` prefixes. PostgreSQL, the API and optional monitoring run with the repository's Compose configuration. One host is intentionally a single failure domain; S3 recovery onto another host is required before claiming host-loss resilience.

The host has a public IPv4 address for outbound package downloads and AWS APIs. Its security group has **zero ingress rules**, with outbound TCP 80/443 only. Application and monitoring ports bind to loopback. Administration and browser access use authenticated AWS Systems Manager sessions; there is no SSH key or public application listener. This avoids a NAT Gateway for the lab, but EC2, EBS, public IPv4, S3 and registry storage remain billable. A private subnet plus VPC endpoints is a possible later reviewed architecture, rather than an implied current feature.

The encrypted gp3 root disk holds Docker's PostgreSQL volume and is retained when an instance terminates. It is not automatically attached to a replacement host. AMI or bootstrap changes can propose host replacement; review the plan, back up first, and restore into the replacement. Retained volumes incur charges until explicitly handled by their owner. Retention is protection against accidental deletion, not a restore proof.

S3 blocks public access, enforces TLS and bucket-owner ownership, enables versioning and default SSE-S3 encryption, and has Terraform `prevent_destroy` plus `force_destroy = false`. Backup objects expire after the configured 90 days by default; noncurrent versions expire after 30 days. Release bundles expire after 90 days. Lifecycle expiry still deletes data even when `prevent_destroy` is set. These controls are neither Object Lock nor protection against an account administrator; review retention before storing required recovery data. The host and delivery role have no backup-delete permissions.

ECR tags are immutable, basic scanning runs on push, and release scripts use the image **digest** as runtime identity. There is no automatic registry garbage collection: retain rollback images until a separate reviewed retention policy exists.

## Local source checks

Install Terraform 1.10 or newer (under 2.0). Both modules use AWS provider 6.62.x and include the generated dependency locks. These commands do not provision resources:

```bash
terraform -chdir=infra fmt -recursive -check
terraform -chdir=infra/aws init -backend=false
terraform -chdir=infra/aws validate
terraform -chdir=infra/aws test
terraform -chdir=infra/state-bootstrap init -backend=false
terraform -chdir=infra/state-bootstrap validate
bash -n infra/aws/bootstrap.sh
```

The native Terraform tests use a mocked provider. They check the no-ingress configuration, encrypted retained disk, immutable image tags, disabled-by-default delivery, accepted exact OIDC subjects and rejection of wildcard or wrong-repository identities. IAM policy-document JSON is substituted in the mocked tests; they do not validate IAM behavior against AWS. `validate` confirms syntax/provider schema, not successful provisioning.

Verification on 2026-10-14: Terraform 1.16.5, AWS provider 6.62.0; formatting, both validations, five mocked tests, and bootstrap shell syntax passed. The Terraform binary was downloaded locally from HashiCorp Releases and its SHA256 matched the official checksum file. Initialization downloaded the HashiCorp-signed provider; neither step used AWS credentials.

## State and approved provisioning preparation

The default local backend is for preparation only. `*.tfstate*`, `.terraform/`, actual `*.tfvars`, backend operator configuration and saved plans are ignored. Provider `.terraform.lock.hcl` files are intended source artifacts. State and plan files may contain sensitive values and must not be committed or attached as evidence.

`infra/state-bootstrap` is an independent, retained private state bucket with encryption and versioning. It has no expiration policy and no workload dependency. After account/region/budget review and explicit authorization, an operator can initialize/plan that module using a copied, ignored `terraform.tfvars`. Applying it is a separately authorized billable operation. Keep its initial local state securely outside Git; migrate it into a separate key in the state bucket once the bucket exists.

For the workload, copy `infra/aws/backend.tf.example` to `backend.tf` and `backend.s3.hcl.example` to `backend.s3.hcl`, replacing only bucket/region identifiers. Run `terraform init -migrate-state -backend-config=backend.s3.hcl` after the state bucket exists. HashiCorp's S3 backend supports native locking with `use_lockfile = true`; no DynamoDB table is required. The operator's backend identity needs `s3:ListBucket` on the state bucket, `GetObject`/`PutObject` on the exact state key, and `GetObject`/`PutObject`/`DeleteObject` on that key's `.tflock` object. Workload instance/delivery identities intentionally have no state access.

Copy `infra/aws/terraform.tfvars.example` to ignored `terraform.tfvars`, then supply an approved region, unique backup bucket, reviewed instance type and optional delivery settings. The Canonical public SSM parameter resolves the current Ubuntu 24.04 amd64 image; pin `ami_id` after the first reviewed plan to avoid an unreviewed AMI replacement on a later run. The type must match amd64. Do not enter access keys in Terraform files. Use an operator AWS SSO/profile session and a separately reviewed provisioning identity. A plan requires account access and resolves actual resources; none was run in this implementation session. Never run `apply` or `destroy` from these notes without scope authorization.

Teardown must separately consider retained EBS, the nonempty ECR repository and the protected S3 buckets. Removing `prevent_destroy`, deleting volumes/images/backup objects, or importing existing infrastructure is not part of the local prototype authorization. Preserve state and backup ownership when compute is retired.

## Host setup and runtime secrets

The non-secret `bootstrap.sh` user data installs Docker Engine/Compose from Docker's official Ubuntu repository, the official AWS CLI Snap, and starts the Ubuntu SSM Agent. It creates root-only `/opt/launchops/shared` and `/opt/launchops/releases`. Bootstrap installs stable packages at execution time; package versions are not a frozen machine image. Inspect `/var/log/launchops-bootstrap.log`, `cloud-init status --wait`, Docker/Compose versions and SSM registration before an authorized deployment. This script was syntax checked on macOS and has not run on EC2.

An operator must securely create `/opt/launchops/shared/.env` on the host, owner root and mode `0600`. Use the repository example's runtime variable names, a unique PostgreSQL password, and absolute shared paths for backup artifacts/status so changing a release directory cannot move recovery data:

```dotenv
POSTGRES_PASSWORD=<operator-generated secret>
BACKUP_DIRECTORY=/opt/launchops/shared/backups
BACKUP_STATUS_DIRECTORY=/opt/launchops/shared/runtime/backup-status
```

The delivery scripts supply `APP_IMAGE` and `APP_VERSION`; the active release metadata lives in `shared/releases.json`. Runtime secrets are never included in the release bundle or sent through GitHub/SSM command text. A changed PostgreSQL password in `.env` does not rotate the existing database password: that requires an explicit database procedure.

Optionally supply a **pre-existing** `application_secret_arn` (and its customer-managed KMS key ARN if applicable). Terraform grants the host access only to that secret. It creates no secret value and does not read one into state. Before deployment, the operator retrieves the secret directly on the host to a mode-0600 file, without echoing it or placing it in a RunCommand parameter. The workflow does not automatically perform this setup.

The host IAM role provides SSM access, ECR pull, backup put/get under `backups/*`, and release-bundle get under `releases/*`. IMDSv2 is required with hop limit 1, so bridged application containers cannot inherit host credentials. For cloud backups, perform the local container dump first and run S3 transfer with the host AWS CLI (see the recovery runbook); container S3 access needs an explicit credentials arrangement and is not assumed. No access keys should be mounted into the application.

## Delivery identity and outputs

With `github_repository` empty, Terraform creates no GitHub OIDC provider or delivery role. After a repository exists, configure its protected **release1** environment with required reviewers and allowed branches. Supply `github_repository` and its **actual exact** `github_oidc_subject`; the trust policy checks that subject and audience `sts.amazonaws.com`. GitHub documents immutable owner/repository IDs in subjects for some repositories created after 2026-07-15. Both legacy `repo:owner/repository:environment:release1` and matching immutable-ID formats are accepted; wildcard or other-repository subjects are rejected. If the account already has GitHub's OIDC provider, pass `existing_github_oidc_provider_arn` instead of trying to create a duplicate.

The delivery role can push/pull only this ECR repository, upload/download only `releases/*`, and invoke only the standard `AWS-RunShellScript` document on this exact instance carrying `LaunchOpsDeploymentTarget=<project_name>`. Authentication/result-read APIs that do not support resource-level permissions use required wildcard resources. SSM command execution is privileged on that host; protect the environment and review workflow changes accordingly. This role cannot provision infrastructure or read backups/runtime secrets.

Map Terraform outputs to protected environment variables:

| Output | GitHub variable |
|---|---|
| `aws_region` | `AWS_REGION` |
| `aws_account_id` | `AWS_ACCOUNT_ID` |
| `github_deploy_role_arn` | `AWS_ROLE_ARN` |
| `ecr_repository_name` | `ECR_REPOSITORY` |
| `instance_id` | `DEPLOY_INSTANCE_ID` |
| `backup_bucket_name` | `DEPLOY_ARTIFACT_BUCKET` |

`ecr_repository_url` is the runtime registry location; `backup_bucket_name` also supplies the backup bucket. Manual delivery/rollback is described in `docs/DELIVERY.md`. A workflow source check is not evidence that GitHub federation, ECR push or SSM execution worked.

## Private HTTPS and access

The HTTPS profile uses Caddy's internal CA for `https://localhost:8443`, while its host listener remains loopback. On an approved deployed host, use the `ssm_https_forward_command` output to forward 8443 to local 8443. AWS CLI, the Session Manager plugin, operator session IAM permissions and a managed SSM node are prerequisites. A browser needs the generated Caddy root CA securely retrieved and trusted by the operator; do not disable certificate verification as proof of HTTPS. Internal-CA TLS is preparation, not a publicly trusted certificate or a public launch.

The `ssm_http_forward_command` output forwards the private API on 8000 for a controlled diagnostic session. Public HTTPS requires a domain, DNS/certificate decisions, access control and separate authorization; no ingress rule for that is present. Session Manager port-forwarding sessions do not record application traffic, so application logs remain important.

## Official references checked

- [Docker's Ubuntu installation](https://docs.docker.com/engine/install/ubuntu/) — signed repository and Compose plugin.
- [Canonical's AWS image selectors](https://ubuntu.com/aws/docs/aws-how-to/instances/find-ubuntu-images/) — public SSM parameter and architecture.
- [AWS SSM session and port-forwarding requirements](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html) and [Ubuntu agent service](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-status-and-restart.html).
- [AWS CLI installation choices](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) — official Snap package.
- [GitHub OIDC on AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws) — exact environment subject and immutable-ID caveat.
- [HashiCorp AWS OIDC resource source documentation](https://github.com/hashicorp/terraform-provider-aws/blob/main/website/docs/r/iam_openid_connect_provider.html.markdown) — optional thumbprint support for GitHub.
- [AWS immutable ECR tags](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html).
- [HashiCorp S3 backend](https://developer.hashicorp.com/terraform/language/backend/s3) — native lockfile, state versioning and backend IAM.
