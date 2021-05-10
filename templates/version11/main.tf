variable "location" {
  type        = "string"
  description = "Primary location to which the tracing resources are deployed."
}

variable "location_suffix" {
  type        = "string"
  description = "Primary location short name to which the tracing resources are deployed."
}

variable "app" {
  type        = "string"
  description = "An abbreviated version of the application name."
}

variable "env" {
  type        = "string"
  description = "An abbreviated version of the environment name."
}

provider "azurerm" {
  features {}
}

terraform {
  backend "azurerm" {}
}

locals {
  suffix = "-core-${var.env}-${var.location_suffix}-${var.app}"
  suffix_2 = "core${var.env}${var.location_suffix}${var.app}"
}
resource "azurerm_resource_group" "rg_core" {
  name      = "rg${local.suffix}"
  location  = "${var.location}"
}