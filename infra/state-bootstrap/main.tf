# AI-assisted independent state storage bootstrap. Apply only with explicit authorization.
terraform {
  required_version = ">= 1.10, < 2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.62.0"
    }
  }
}
provider "aws" {
  region = var.aws_region
}
variable "aws_region" {
  type        = string
  description = "Operator-selected approved AWS region."
}
variable "state_bucket_name" {
  type        = string
  description = "Globally unique dedicated state bucket; separate ownership/lifecycle from workload."
}
resource "aws_s3_bucket" "state" {
  bucket        = var.state_bucket_name
  force_destroy = false
  tags          = { Project = "launchops", Purpose = "TerraformState", ManagedBy = "Terraform" }
  lifecycle { prevent_destroy = true }
}
resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_ownership_controls" "state" {
  bucket = aws_s3_bucket.state.id
  rule { object_ownership = "BucketOwnerEnforced" }
}
resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}
data "aws_iam_policy_document" "tls" {
  statement {
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.state.arn, "${aws_s3_bucket.state.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id
  policy = data.aws_iam_policy_document.tls.json
}
output "state_bucket_name" {
  value = aws_s3_bucket.state.id
}
