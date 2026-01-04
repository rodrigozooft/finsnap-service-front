locals {
  s3_origin_id = "${var.project_name}-${var.environment}-s3-origin"
}

# Origin Access Identity for secure S3 access
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.project_name}-${var.environment} frontend"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "distribution" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name}-${var.environment} frontend distribution"
  default_root_object = "index.html"
  aliases             = var.domain_aliases
  price_class         = var.price_class

  origin {
    domain_name = var.s3_bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  # Default cache behavior (HTML - no cache for updates)
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # Static assets cache (JS, CSS, images - long cache with hash busting)
  ordered_cache_behavior {
    path_pattern           = "/assets/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 31536000 # 1 year
    default_ttl = 31536000
    max_ttl     = 31536000
  }

  # SPA routing: 403 Forbidden -> index.html (for direct route access)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # SPA routing: 404 Not Found -> index.html (for client-side routing)
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-distribution"
  }
}
