data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}
data "aws_ssm_parameter" "ubuntu" {
  count = var.ami_id == "" ? 1 : 0
  name  = var.ami_ssm_parameter
}

resource "aws_vpc" "lab" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = { Name = "${var.project_name}-lab" }
}

resource "aws_subnet" "host" {
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = "10.42.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true
  tags                    = { Name = "${var.project_name}-outbound" }
}

resource "aws_internet_gateway" "outbound" {
  vpc_id = aws_vpc.lab.id
}
resource "aws_route_table" "outbound" {
  vpc_id = aws_vpc.lab.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.outbound.id
  }
}
resource "aws_route_table_association" "host" {
  subnet_id      = aws_subnet.host.id
  route_table_id = aws_route_table.outbound.id
}

resource "aws_security_group" "host" {
  name_prefix = "${var.project_name}-outbound-only-"
  description = "No ingress. Administration and private access through AWS SSM."
  vpc_id      = aws_vpc.lab.id
  # Intentionally no ingress rules: no SSH, HTTP, HTTPS, PostgreSQL or monitoring exposure.
  ingress = []
  egress {
    description = "Bootstrap repositories, AWS APIs and image registry over HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    description = "Ubuntu apt repositories can use HTTP before Docker HTTPS repository setup"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                         = var.ami_id != "" ? var.ami_id : data.aws_ssm_parameter.ubuntu[0].value
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.host.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.host.id]
  iam_instance_profile        = aws_iam_instance_profile.host.name
  user_data                   = file("${path.module}/bootstrap.sh")
  user_data_replace_on_change = true
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }
  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.root_volume_gib
    encrypted             = true
    delete_on_termination = false
  }
  tags = {
    Name                      = "${var.project_name}-host"
    LaunchOpsDeploymentTarget = var.project_name
  }
  depends_on = [aws_route_table_association.host, aws_iam_role_policy_attachment.ssm]
}

resource "aws_ecr_repository" "app" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false
  image_scanning_configuration {
    scan_on_push = true
  }
  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_s3_bucket" "backups" {
  bucket        = var.backup_bucket_name
  force_destroy = false
  lifecycle {
    prevent_destroy = true
  }
}
resource "aws_s3_bucket_public_access_block" "backups" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_ownership_controls" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule { object_ownership = "BucketOwnerEnforced" }
}
resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration { status = "Enabled" }
}
resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}
resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  rule {
    id     = "backup-retention"
    status = "Enabled"
    filter { prefix = "backups/" }
    expiration { days = var.backup_retention_days }
    noncurrent_version_expiration { noncurrent_days = 30 }
    abort_incomplete_multipart_upload { days_after_initiation = 7 }
  }
  rule {
    id     = "release-bundle-retention"
    status = "Enabled"
    filter { prefix = "releases/" }
    expiration { days = 90 }
    noncurrent_version_expiration { noncurrent_days = 30 }
    abort_incomplete_multipart_upload { days_after_initiation = 7 }
  }
  depends_on = [aws_s3_bucket_versioning.backups]
}
data "aws_iam_policy_document" "bucket_tls" {
  statement {
    sid       = "DenyInsecureTransport"
    effect    = "Deny"
    actions   = ["s3:*"]
    resources = [aws_s3_bucket.backups.arn, "${aws_s3_bucket.backups.arn}/*"]
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
resource "aws_s3_bucket_policy" "backups" {
  bucket = aws_s3_bucket.backups.id
  policy = data.aws_iam_policy_document.bucket_tls.json
}
