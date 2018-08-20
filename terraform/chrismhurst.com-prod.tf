### Instructions ###
# 1. Create ACM certificate and get it authorized via DNS
# 2. Create a logging bucket if needed, or remove logging configuration
# 2. Fill in variables

#################
### Variables ###
#################

#variable "access_key" {}
#variable "secret_key" {}
variable "region" {
  default = "us-east-1"
}

variable "site_unique_name" {
  default = "chrismhurst"
}

variable "certificate_subject_name" {
  default = "chrismhurst.com"
}

variable "cloudfront_alias_csv" {
  default = ["chrismhurst.com", "www.chrismhurst.com"]
}

#####################
### Global Config ###
#####################

provider "aws" {
  region = "${var.region}"
}

##########################
### Data Bucket Config ###
##########################

resource "aws_s3_bucket" "site-chrismhurst" {
  bucket = "site-chrismhurst.com"
  acl    = "public-read"
  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "site-chrismhurst" {
  bucket = "${aws_s3_bucket.site-chrismhurst.bucket}"

  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::site-chrismhurst.com/*"
        }
    ]
}
EOF
}

#############################
### Logging Bucket Config ###
#############################

resource "aws_s3_bucket" "logging-chrismhurst" {
  bucket = "logging-chrismhurst.com"
}

resource "aws_s3_bucket_policy" "logging-chrismhurst" {
  bucket = "${aws_s3_bucket.logging-chrismhurst.bucket}"

  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "awslogsdelivery",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::162777425019:root"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::logging-chrismhurst.com/*"
        }
    ]
}
EOF
}

#####################
### ACM Data Pull ###
#####################

data "aws_acm_certificate" "site-chrismhurst" {
  domain      = "${var.certificate_subject_name}"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}
#########################
### CloudFront Config ###
#########################

locals {
  s3_origin_id = "Root-${aws_s3_bucket.site-chrismhurst.bucket}"
}

resource "aws_cloudfront_origin_access_identity" "site-chrismhurst" {
}

resource "aws_cloudfront_distribution" "site-chrismhurst" {
  tags {}

  origin {
    domain_name = "${aws_s3_bucket.site-chrismhurst.bucket_regional_domain_name}"
    origin_id   = "${local.s3_origin_id}"

    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.site-chrismhurst.cloudfront_access_identity_path}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = ""
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = "${aws_s3_bucket.site-chrismhurst.bucket_domain_name}"
###    prefix          = "${aws_s3_bucket.site-chrismhurst.id}"
  }

  aliases = "${var.cloudfront_alias_csv}"

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "${local.s3_origin_id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = "${data.aws_acm_certificate.site-chrismhurst.arn}"
    minimum_protocol_version       = "TLSv1.1_2016"
    ssl_support_method             = "sni-only"
  }
}
