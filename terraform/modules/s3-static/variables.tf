variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "cloudfront_oai_arn" {
  description = "IAM ARN of the CloudFront Origin Access Identity"
  type        = string
}
