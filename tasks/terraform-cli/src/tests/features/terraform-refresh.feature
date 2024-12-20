Feature: terraform refresh

    terraform refresh [options] [dir]

    Scenario: refresh without service connection
        Given terraform exists
        And terraform command is "refresh"
        And running command "terraform refresh" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with azurerm
        Given terraform exists
        And terraform command is "refresh"
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
            | -p=servicePrincipalKey123 |
        And task configured to run az login
        And running command "terraform refresh" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And azure login is executed with the following options
            | option                |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with azurerm and command options
        Given terraform exists
        And terraform command is "refresh" with options "-input=true -lock=false -no-color"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli not exists
        And running command "terraform refresh -input=true -lock=false -no-color" returns successful result
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform refresh -input=true -lock=false -no-color" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with secure var file
        Given terraform exists        
        And terraform command is "refresh"
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
            | -p=servicePrincipalKey123 |
        And task configured to run az login
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.vars"
        And running command "terraform refresh -var-file=./src/tests/default.vars" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh -var-file=./src/tests/default.vars" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And azure login is executed with the following options
            | option                |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with secure env file
        Given terraform exists        
        And terraform command is "refresh"
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
            | -p=servicePrincipalKey123 |
        And task configured to run az login
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And running command "terraform refresh" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh" with the following environment variables
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
            | -p=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with azurerm and ManagedServiceIdentity auth scheme
        Given terraform exists
        And terraform command is "refresh"
        And azurerm service connection "dev" exists as
            | scheme         | ManagedServiceIdentity       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option      |
            | --identity  |
        And task configured to run az login
        And running command "terraform refresh" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_USE_MSI         | true                   |
        And azure login is executed with the following options
            | option      |
            | --identity  |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: refresh with azurerm and WorkloadIdentityFederation auth scheme
        Given terraform exists
        And terraform command is "refresh"
        And azurerm service connection "dev" exists as
            | scheme         | WorkloadIdentityFederation |
            | subscriptionId | sub1                       |
            | tenantId       | ten1                       |
            | clientId       | servicePrincipal1          |
            | idToken    | oidcToken1                 |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                       |
            | --service-principal          |
            | -t ten1                      |
            | -u servicePrincipal1         |
            | --allow-no-subscriptions     |
            | --federated-token oidcToken1 |
        And task configured to run az login
        And running command "terraform refresh" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform refresh" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_OIDC_TOKEN      | oidcToken1             |
            | ARM_USE_OIDC        | true                   |
        And azure login is executed with the following options
            | option                       |
            | --service-principal          |
            | -t ten1                      |
            | -u servicePrincipal1         |
            | --allow-no-subscriptions     |
            | --federated-token oidcToken1 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"