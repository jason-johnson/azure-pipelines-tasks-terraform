terraform {
  backend "gcs" {
  }
}

provider "google" {
}

resource "google_storage_bucket" "gcsb_test" {
  name          = "gcs-test-eus-czp"
  location      = "US"
}