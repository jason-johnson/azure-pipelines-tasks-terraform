@tf-import
Feature: terraform import

    terraform import [options] [resource address] [resource id]

    Scenario: import without service connection
        Given terraform exists
        And terraform command is "import"
        And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And running command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: import with azurerm
        Given terraform exists
        And terraform command is "import"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And running command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And azure login is executed with the following options
            | option                |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"
    
    Scenario: import with azurerm and command options
        Given terraform exists
        And terraform command is "import" with options "-input=true -lock=false -no-color"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli not exists
        And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And running command "terraform import -input=true -lock=false -no-color azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform import -input=true -lock=false -no-color azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: import with secure var file
        Given terraform exists        
        And terraform command is "import"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.vars"
        And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And running command "terraform import -var-file=./src/tests/default.vars azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform import -var-file=./src/tests/default.vars azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And azure login is executed with the following options
            | option                |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: import with secure env file
        Given terraform exists        
        And terraform command is "import"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And resource target provided with address "azurerm_resource_group.rg" and id "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
        And running command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform import azurerm_resource_group.rg /subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And azure login is executed with the following options
            | option                |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"