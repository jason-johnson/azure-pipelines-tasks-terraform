terraform {
  backend "s3" {
  }
}

provider "aws" {
}

resource "aws_s3_bucket" "s3b_test" {
  bucket = "s3-test-eus-czp"
  acl    = "private"
}