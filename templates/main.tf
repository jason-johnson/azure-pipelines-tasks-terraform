provider "azurerm" {
    features {
    }
}

terraform {
  backend "azurerm" {
     use_azuread_auth = true
  }
}