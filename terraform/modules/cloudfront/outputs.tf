output "distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.id
}

output "distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.arn
}

output "distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.distribution.domain_name
}

output "oai_arn" {
  description = "ARN of the Origin Access Identity"
  value       = aws_cloudfront_origin_access_identity.oai.iam_arn
}

output "oai_iam_arn" {
  description = "IAM ARN of the Origin Access Identity (for S3 bucket policy)"
  value       = aws_cloudfront_origin_access_identity.oai.iam_arn
}
