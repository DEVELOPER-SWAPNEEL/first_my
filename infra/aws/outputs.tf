output "aws_region" {
  value = var.aws_region
}
output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}
output "instance_id" {
  value = aws_instance.app.id
}
output "backup_bucket_name" {
  value = aws_s3_bucket.backups.id
}
output "backup_bucket_arn" {
  value = aws_s3_bucket.backups.arn
}
output "ecr_repository_name" {
  value = aws_ecr_repository.app.name
}
output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}
output "github_deploy_role_arn" {
  value = try(aws_iam_role.github_deploy[0].arn, null)
}
output "ssm_http_forward_command" {
  description = "Requires AWS CLI and Session Manager plugin, operator IAM access and a deployed app."
  value       = "aws ssm start-session --region ${var.aws_region} --target ${aws_instance.app.id} --document-name AWS-StartPortForwardingSession --parameters '{\"portNumber\":[\"8000\"],\"localPortNumber\":[\"8000\"]}'"
}
output "ssm_https_forward_command" {
  description = "HTTPS through Caddy's private CA; requires deployed HTTPS profile and trusting the generated CA."
  value       = "aws ssm start-session --region ${var.aws_region} --target ${aws_instance.app.id} --document-name AWS-StartPortForwardingSession --parameters '{\"portNumber\":[\"8443\"],\"localPortNumber\":[\"8443\"]}'"
}
