terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Local backend for initial setup
  backend "local" {
    path = "terraform.tfstate"
  }

  # Uncomment after initial setup for remote state
  # backend "s3" {
  #   bucket         = "finsnap-terraform-state"
  #   key            = "finsnap-frontend/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "finsnap-terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront module (creates OAI needed by S3)
module "cloudfront" {
  source = "../../modules/cloudfront"

  project_name                   = var.project_name
  environment                    = var.environment
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  s3_bucket_id                   = module.s3.bucket_id
  certificate_arn                = var.certificate_arn
  domain_aliases                 = [var.domain_name]
  price_class                    = var.price_class
}

# S3 bucket for static files
module "s3" {
  source = "../../modules/s3-static"

  project_name       = var.project_name
  environment        = var.environment
  cloudfront_oai_arn = module.cloudfront.oai_iam_arn
}

# IAM for GitHub Actions deployment
module "iam" {
  source = "../../modules/iam"

  project_name                = var.project_name
  environment                 = var.environment
  github_org                  = var.github_org
  github_repo                 = var.github_repo
  s3_bucket_arn               = module.s3.bucket_arn
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
  create_github_oidc_provider = false # Already exists from finsnap-services
}
