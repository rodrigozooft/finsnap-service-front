variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "finsnap"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Domain name for the frontend"
  type        = string
  default     = "services.finsnap.tax"
}

variable "github_org" {
  description = "GitHub organization name"
  type        = string
  default     = "rodrigozooft"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "finsnap-service-front"
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate (must be in us-east-1 for CloudFront)"
  type        = string
  default     = "arn:aws:acm:us-east-1:183037997142:certificate/15e66c05-f792-4c99-96d4-da3dbc90eee6"
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}
