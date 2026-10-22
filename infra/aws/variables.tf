variable "aws_region" {
  description = "Explicit deployment region. No region/account is assumed."
  type        = string
  validation {
    condition     = can(regex("^[a-z]{2}(-gov)?-[a-z]+-[0-9]+$", var.aws_region))
    error_message = "Provide an AWS region identifier."
  }
}

variable "project_name" {
  description = "Resource/tag prefix for this isolated lab."
  type        = string
  default     = "launchops"
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,31}$", var.project_name))
    error_message = "Use 3–32 lowercase letters, digits or hyphens, beginning with a letter."
  }
}

variable "backup_bucket_name" {
  description = "Globally unique, operator-selected private bucket; backups/ and releases/ prefixes."
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$", var.backup_bucket_name))
    error_message = "Use a unique 3–63 character lowercase bucket name without dots."
  }
}

variable "instance_type" {
  description = "amd64 EC2 type; budget approval required before provisioning."
  type        = string
  default     = "t3.small"
}

variable "ami_id" {
  description = "Optional reviewed/pinned Ubuntu 24.04 amd64 AMI. Empty resolves Canonical's current public SSM parameter."
  type        = string
  default     = ""
  validation {
    condition     = var.ami_id == "" || can(regex("^ami-[0-9a-f]+$", var.ami_id))
    error_message = "AMI must be empty or an ami- identifier."
  }
}

variable "ami_ssm_parameter" {
  description = "Canonical Ubuntu 24.04 amd64 gp3 image selector; pin ami_id after first reviewed plan."
  type        = string
  default     = "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id"
}

variable "root_volume_gib" {
  description = "Encrypted root/data disk. Retained if instance terminates; operator must manage retained volume cost."
  type        = number
  default     = 30
  validation {
    condition     = var.root_volume_gib >= 20 && var.root_volume_gib <= 100
    error_message = "For this small lab choose 20–100 GiB."
  }
}

variable "backup_retention_days" {
  description = "Current backup expiry; lifecycle deletion remains effective despite Terraform prevent_destroy."
  type        = number
  default     = 90
  validation {
    condition     = var.backup_retention_days >= 7
    error_message = "Backup retention must be at least seven days."
  }
}

variable "github_repository" {
  description = "Optional owner/repo for delivery; empty omits GitHub federation and deploy role."
  type        = string
  default     = ""
  validation {
    condition     = var.github_repository == "" || can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repository))
    error_message = "Use owner/repository or leave empty."
  }
}

variable "github_environment" {
  description = "Protected GitHub environment; must match the delivery workflow's environment."
  type        = string
  default     = "release1"
  validation {
    condition     = can(regex("^[A-Za-z0-9_-]+$", var.github_environment))
    error_message = "Use a simple GitHub environment name."
  }
}

variable "github_oidc_subject" {
  description = "Exact actual GitHub JWT sub for repository/environment; required when delivery is enabled. New repositories may use immutable owner/repo IDs. Never use wildcards."
  type        = string
  default     = ""
  validation {
    condition = var.github_repository == "" || (
      var.github_oidc_subject == "repo:${var.github_repository}:environment:${var.github_environment}" ||
      can(regex(format("^repo:%s@[0-9]+/%s@[0-9]+:environment:%s$",
        replace(split("/", var.github_repository)[0], ".", "\\."),
        replace(try(split("/", var.github_repository)[1], ""), ".", "\\."),
      var.github_environment), var.github_oidc_subject))
    )
    error_message = "Enabled delivery requires the exact configured repository/environment subject (legacy or immutable owner/repo IDs), without wildcards."
  }
}

variable "existing_github_oidc_provider_arn" {
  description = "Use the account's existing token.actions.githubusercontent.com provider if present; avoids duplicate provider creation."
  type        = string
  default     = ""
}

variable "ecr_repository_name" {
  description = "Private immutable-image registry repository; must match GitHub ECR_REPOSITORY variable."
  type        = string
  default     = "launchops/app"
}

variable "application_secret_arn" {
  description = "Optional pre-existing Secrets Manager runtime .env secret ARN. Values are never managed by Terraform."
  type        = string
  default     = ""
}

variable "application_secret_kms_key_arn" {
  description = "Optional customer-managed KMS key used by that secret; empty for the service managed key."
  type        = string
  default     = ""
}
