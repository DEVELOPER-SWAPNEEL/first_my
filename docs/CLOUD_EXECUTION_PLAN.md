# Next Release 1 gate: reviewed private AWS execution

**Preparation only. Execution is not authorized.** Use the actual `infra/aws`, `infra/state-bootstrap`, existing Compose files and protected manual delivery workflow. Local containers do not prove cloud routing, host bootstrap, IAM, S3 transfer or digest rollback.

## Inputs needed before an executable plan

- Personal sandbox AWS account ID, chosen region and operator SSO/profile identity; no employer credentials or keys in chat/Git.
- Spending ceiling, intended demonstration hours and review of retained storage/cleanup ownership.
- Unique backup bucket and state bucket names, actual GitHub owner/repository, protected `release1` environment, exact OIDC subject and an existing provider ARN if appropriate.
- Reviewed amd64 instance type and Ubuntu24.04 AMI. Source currently defaults to `t3.small` and30GiB gp3; measure local memory first and explicitly approve a larger type if monitoring needs it. Build the future ECR image for the chosen host architecture; local arm64 verification is not an amd64 image proof.
- Secure runtime PostgreSQL/Grafana passwords and persistent absolute `/opt/launchops/shared/...` backup/status paths. Secrets Manager ARN is optional and must refer to an existing secret; Terraform never stores its value.
- No domain is needed for the first private SSM-forwarded demo. Public HTTPS would require a controlled domain/DNS, certificate and authentication/access review plus new authorization. The existing internal CA is not a publicly trusted certificate.

## Expected resources and current estimate method

One VPC/subnet/Internet Gateway, outbound-only security group, EC2 instance with public IPv4 for outbound access, encrypted retained root EBS, instance IAM/SSM, private immutable ECR, private versioned S3 backup/release storage and a separately retained state bucket. No NAT Gateway, load balancer or Kubernetes control plane is in this architecture. Optional Secrets Manager/KMS inputs may add charges if chosen.

Build a dated estimate in [AWS Pricing Calculator](https://calculator.aws/) for the approved region/type/runtime: EC2 hours (include burstable CPU credit behavior),30GiB gp3 for the whole retention period, one public IPv4 while allocated, ECR image GB-month, S3 current/noncurrent versions and requests, outbound transfer, and optional secret/key costs. Add the state bucket and storage remaining after compute stops. Save estimate inputs and URL, not credentials or private billing screenshots. Pricing/credits must be checked at review time; no price or free-tier eligibility is assumed here. [Calculator instructions](https://docs.aws.amazon.com/pricing-calculator/latest/userguide/create-configure-estimate.html), [VPC/IPv4 pricing](https://aws.amazon.com/vpc/pricing/), [ECR pricing](https://aws.amazon.com/ecr/pricing/), [S3 pricing](https://aws.amazon.com/s3/pricing/).

## Identity, access and proposed order

1. Review the cost/resource/retention plan and obtain explicit account/region/provisioning authorization. Configure an operator SSO session with reviewed provision/state permissions. Verify account identity privately.
2. Review and provision state bootstrap only after approval; preserve initial state securely, then configure S3 native locking/versioning. Workload and delivery roles have no state access.
3. Produce a real AWS plan and review actual AMI, subnet/rules/IAM, retained EBS, bucket retention and exact OIDC identity. No apply follows automatically from a passing plan.
4. Once separately approved, provision the no-ingress host and verify bootstrap/Docker/SSM. Supply runtime `.env` securely on host, mode600. Use short-lived GitHub OIDC and the exact environment subject for image build/scan/delivery; instance IAM supplies ECR pull and scoped S3 access. No SSH or long-lived CI AWS key.
5. Invoke the protected manual release workflow only under publication/deployment authorization. Verify digest, basic scan gate, source-bundle checksum, migration, expected release, real create/retrieve/update and private SSM access. Verify monitoring on that host and TLS using its own CA, not the local CA copied from this laptop.
6. Perform separately authorized synthetic cloud drills: bad image/previous-digest rollback, actual S3 upload/download/fresh-target restore, then replacement host recovery. Host IMDSv2 hop limit1 keeps IAM credentials out of bridge containers; S3 copy is host-side. Record real timings and cost, distinguish app rollback from DB restoration.

## Teardown review

Stop app/monitoring and terminate only the approved host when appropriate. Root EBS remains allocated because `delete_on_termination=false`; it must be inventoried and billed until separately handled. ECR images and versioned backup/release objects persist. S3 `prevent_destroy` blocks a blanket workload destroy, and lifecycle policies can still expire objects. State is separately retained and is never routine cleanup. Review an exact teardown plan/resource inventory; do not remove safeguards or retained data as a shortcut. Preserve the last verified image, backup and ownership records until the agreed retention ends.

Cloud execution, S3 transfer, external notifications, public HTTPS and cloud rollback remain unmet Release 1 gates. Release 2 stays deferred, and learner understanding is not established by any automated run.
