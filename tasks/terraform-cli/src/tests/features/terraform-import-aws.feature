@tf-import
Feature: terraform import for aws

  terraform import [options] [resource address] [resource id]

  Scenario: import without aws service connection
    Given terraform exists
    And terraform command is "import"
    And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
    And running command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" without the following environment variables
      | AWS_ACCESS_KEY_ID     |
      | AWS_SECRET_ACCESS_KEY |
      | AWS_REGION            |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: import with aws
    Given terraform exists
    And terraform command is "import"
    And aws provider service connection "env_test_aws" exists as
      | username | foo |
      | password | bar |
    And aws provider region is configured as "us-east-1"
    And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
    And running command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
    When the terraform cli task is run
    Then the terraform cli task executed command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" with the following environment variables
      | AWS_ACCESS_KEY_ID     | foo       |
      | AWS_SECRET_ACCESS_KEY | bar       |
      | AWS_REGION            | us-east-1 |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"
