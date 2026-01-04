variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 bucket for deployment"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  type        = string
}

variable "create_github_oidc_provider" {
  description = "Whether to create the GitHub OIDC provider (set to false if it already exists)"
  type        = bool
  default     = false
}
