output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3.bucket_id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.distribution_domain_name
}

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions role (use for AWS_ROLE_ARN_PROD secret)"
  value       = module.iam.github_actions_role_arn
}

output "cloudflare_dns_configuration" {
  description = "DNS configuration for CloudFlare"
  value       = <<-EOT

    Add this CNAME record in CloudFlare:
    - Type: CNAME
    - Name: services
    - Target: ${module.cloudfront.distribution_domain_name}
    - Proxy: Enabled (orange cloud) - optional

  EOT
}

output "github_secrets_configuration" {
  description = "GitHub secrets to configure"
  value       = <<-EOT

    Add these secrets to your GitHub repository:
    - AWS_ROLE_ARN_PROD: ${module.iam.github_actions_role_arn}
    - S3_BUCKET_PROD: ${module.s3.bucket_id}
    - CLOUDFRONT_DISTRIBUTION_ID_PROD: ${module.cloudfront.distribution_id}

  EOT
}
