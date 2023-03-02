terraform {
  backend "s3" {
  }
}

provider "aws" {
}

resource "aws_s3_bucket" "s3b_test" {
  bucket = "s3-test-weu1-pj"
}

resource aws_s3_bucket_acl {
  bucket = aws_s3_bucket.s3b_test.id
  acl    = "private"
}