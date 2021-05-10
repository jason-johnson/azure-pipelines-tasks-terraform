variable "location" {
  type        = string
  description = "Primary location to which the tracing resources are deployed."
}

variable "location_suffix" {
  type        = string
  description = "Primary location short name to which the tracing resources are deployed."
}

variable "app" {
  type        = string
  description = "An abbreviated version of the application name."
}

variable "env" {
  type        = string
  description = "An abbreviated version of the environment name."
}

provider "azurerm" {
    features {
    }
}

terraform {
  backend "azurerm" {}
  required_version = ">= 0.12"
}

locals {
  suffix = "-core-${var.env}-${var.location_suffix}-${var.app}"
  suffix_2 = "core${var.env}${var.location_suffix}${var.app}"
}
resource "azurerm_resource_group" "rg_core" {
  name      = "rg${local.suffix}"
  location  = var.location
}

resource "azurerm_storage_account" "st_core" {
  name                      = "st${local.suffix_2}"
  location                  = var.location
  resource_group_name       = azurerm_resource_group.rg_core.name
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  

  provisioner "local-exec" {
          command = "az storage blob service-properties update --account-name ${azurerm_storage_account.st_core.name} --static-website --index-document index.html --404-document index.html"
  }
}