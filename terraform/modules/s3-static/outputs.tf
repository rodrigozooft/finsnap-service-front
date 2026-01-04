output "bucket_id" {
  description = "ID of the S3 bucket"
  value       = aws_s3_bucket.static.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.static.arn
}

output "bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.static.bucket_regional_domain_name
}
