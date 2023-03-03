terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
  }
}

provider "aws" {
}

resource "aws_s3_bucket" "s3b_test" {
  bucket = "s3-test-weu1-pj"
  force_destroy = true
}

resource "aws_s3_bucket_acl" "acl" {
  bucket = aws_s3_bucket.s3b_test.id
  acl    = "private"
}