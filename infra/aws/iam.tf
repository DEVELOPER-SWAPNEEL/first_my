data "aws_iam_policy_document" "host_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "host" {
  name_prefix        = "${var.project_name}-host-"
  assume_role_policy = data.aws_iam_policy_document.host_assume.json
}
resource "aws_iam_instance_profile" "host" {
  name_prefix = "${var.project_name}-host-"
  role        = aws_iam_role.host.name
}
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.host.name
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
data "aws_iam_policy_document" "host_workload" {
  statement {
    sid       = "ListOnlyBackupAndReleasePrefixes"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.backups.arn]
    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["backups/*", "releases/*"]
    }
  }
  statement {
    sid       = "WriteAndReadBackupsWithoutDelete"
    actions   = ["s3:PutObject", "s3:GetObject", "s3:GetObjectVersion", "s3:AbortMultipartUpload", "s3:ListMultipartUploadParts"]
    resources = ["${aws_s3_bucket.backups.arn}/backups/*"]
  }
  statement {
    sid       = "ReadReleaseBundles"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.backups.arn}/releases/*"]
  }
  statement {
    sid       = "ECRAuthentication"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"] # This API does not support resource-level permissions.
  }
  statement {
    sid       = "PullOnlyOwnRepository"
    actions   = ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer", "ecr:BatchCheckLayerAvailability"]
    resources = [aws_ecr_repository.app.arn]
  }
  dynamic "statement" {
    for_each = var.application_secret_arn != "" ? [var.application_secret_arn] : []
    content {
      sid       = "ReadOperatorManagedRuntimeSecret"
      actions   = ["secretsmanager:GetSecretValue"]
      resources = [statement.value]
    }
  }
  dynamic "statement" {
    for_each = var.application_secret_kms_key_arn != "" ? [var.application_secret_kms_key_arn] : []
    content {
      sid       = "DecryptOnlyRuntimeSecretKey"
      actions   = ["kms:Decrypt"]
      resources = [statement.value]
      condition {
        test     = "StringEquals"
        variable = "kms:ViaService"
        values   = ["secretsmanager.${var.aws_region}.amazonaws.com"]
      }
    }
  }
}
resource "aws_iam_role_policy" "host_workload" {
  name   = "workload-artifacts"
  role   = aws_iam_role.host.id
  policy = data.aws_iam_policy_document.host_workload.json
}

locals {
  github_enabled      = var.github_repository != ""
  github_provider_arn = var.existing_github_oidc_provider_arn != "" ? var.existing_github_oidc_provider_arn : try(aws_iam_openid_connect_provider.github[0].arn, "")
}
resource "aws_iam_openid_connect_provider" "github" {
  count          = local.github_enabled && var.existing_github_oidc_provider_arn == "" ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  # AWS uses trusted root CAs for GitHub; current AWS provider makes thumbprints optional.
}
data "aws_iam_policy_document" "github_assume" {
  count = local.github_enabled ? 1 : 0
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [local.github_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [var.github_oidc_subject]
    }
  }
}
resource "aws_iam_role" "github_deploy" {
  count                = local.github_enabled ? 1 : 0
  name_prefix          = "${var.project_name}-delivery-"
  max_session_duration = 3600
  assume_role_policy   = data.aws_iam_policy_document.github_assume[0].json
}
data "aws_iam_policy_document" "github_deploy" {
  count = local.github_enabled ? 1 : 0
  statement {
    sid       = "ECRAuthentication"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
  statement {
    sid       = "BuildOnlyOwnRepository"
    actions   = ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:InitiateLayerUpload", "ecr:UploadLayerPart", "ecr:CompleteLayerUpload", "ecr:PutImage", "ecr:DescribeImages", "ecr:DescribeImageScanFindings"]
    resources = [aws_ecr_repository.app.arn]
  }
  statement {
    sid       = "UploadOnlyReleaseBundles"
    actions   = ["s3:PutObject", "s3:GetObject", "s3:AbortMultipartUpload", "s3:ListMultipartUploadParts"]
    resources = ["${aws_s3_bucket.backups.arn}/releases/*"]
  }
  statement {
    sid       = "UseOnlyShellDeploymentDocument"
    actions   = ["ssm:SendCommand"]
    resources = ["arn:${data.aws_partition.current.partition}:ssm:${var.aws_region}::document/AWS-RunShellScript"]
  }
  statement {
    sid       = "DeployOnlyThisTaggedInstance"
    actions   = ["ssm:SendCommand"]
    resources = [aws_instance.app.arn]
    condition {
      test     = "StringEquals"
      variable = "ssm:resourceTag/LaunchOpsDeploymentTarget"
      values   = [var.project_name]
    }
  }
  statement {
    sid       = "ReadDeploymentResult"
    actions   = ["ssm:GetCommandInvocation", "ssm:ListCommandInvocations", "ec2:DescribeInstances"]
    resources = ["*"] # These read APIs do not support resource-level scoping.
  }
}
resource "aws_iam_role_policy" "github_deploy" {
  count  = local.github_enabled ? 1 : 0
  name   = "immutable-build-and-single-host-deploy"
  role   = aws_iam_role.github_deploy[0].id
  policy = data.aws_iam_policy_document.github_deploy[0].json
}
