variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  type        = string
}

variable "s3_bucket_id" {
  description = "ID of the S3 bucket"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate (must be in us-east-1 for CloudFront)"
  type        = string
}

variable "domain_aliases" {
  description = "List of domain aliases for the distribution"
  type        = list(string)
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100" # US, Canada, Europe only (cheapest)
}
