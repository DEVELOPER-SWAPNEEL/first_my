# Mocked provider tests exercise configuration decisions without AWS calls/provisioning.
mock_provider "aws" {
  mock_data "aws_caller_identity" {
    defaults = { account_id = "123456789012" }
  }
  mock_data "aws_partition" {
    defaults = { partition = "aws" }
  }
  mock_data "aws_availability_zones" {
    defaults = { names = ["us-east-1a"] }
  }
  mock_data "aws_ssm_parameter" {
    defaults = { value = "ami-0123456789abcdef0" }
  }
  mock_data "aws_iam_policy_document" {
    # Provider normally renders policy documents locally. A valid substitute avoids
    # random mock strings; these tests validate configuration guards, not AWS IAM.
    defaults = { json = "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"sts:AssumeRole\",\"Principal\":{\"Service\":\"ec2.amazonaws.com\"}}]}" }
  }
}
variables {
  aws_region         = "us-east-1"
  backup_bucket_name = "launchops-test-example-only"
}
run "private_retained_lab" {
  command = plan
  assert {
    condition     = length(aws_security_group.host.ingress) == 0
    error_message = "Unauthenticated lab must have no inbound network rules."
  }
  assert {
    condition     = aws_instance.app.metadata_options[0].http_tokens == "required"
    error_message = "Require IMDSv2 on the host."
  }
  assert {
    condition     = aws_instance.app.root_block_device[0].encrypted && !aws_instance.app.root_block_device[0].delete_on_termination
    error_message = "Host data disk must be encrypted and retained on termination."
  }
  assert {
    condition     = aws_s3_bucket.backups.force_destroy == false && aws_s3_bucket_public_access_block.backups.block_public_policy
    error_message = "Backup bucket must reject forced deletion/public policies."
  }
  assert {
    condition     = aws_ecr_repository.app.image_tag_mutability == "IMMUTABLE"
    error_message = "Release tags must never be overwritten."
  }
  assert {
    condition     = length(aws_iam_role.github_deploy) == 0
    error_message = "Do not create delivery federation before a repository is selected."
  }
}
run "exact_delivery_subject" {
  command = plan
  variables {
    github_repository   = "example/launchops"
    github_oidc_subject = "repo:example/launchops:environment:release1"
  }
  assert {
    condition     = length(aws_iam_role.github_deploy) == 1
    error_message = "Configured exact delivery identity should produce one deploy role."
  }
}
run "immutable_delivery_subject" {
  command = plan
  variables {
    github_repository   = "example/launchops"
    github_oidc_subject = "repo:example@123456/launchops@456789:environment:release1"
  }
}
run "reject_wildcard_identity" {
  command = plan
  variables {
    github_repository   = "example/launchops"
    github_oidc_subject = "repo:example/*:environment:release1"
  }
  expect_failures = [var.github_oidc_subject]
}
run "reject_other_repository_identity" {
  command = plan
  variables {
    github_repository   = "example/launchops"
    github_oidc_subject = "repo:other/repository:environment:release1"
  }
  expect_failures = [var.github_oidc_subject]
}
