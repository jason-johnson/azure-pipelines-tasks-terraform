Feature: terraform apply azurerm with subscription override

    terraform apply [options] [dir]

    Scenario: apply with azurerm with management group service connection and subscription override
        Given terraform exists
        And terraform command is "apply"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm subscriptionId is "sub1"
        And running command "terraform apply -auto-approve" returns successful result
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform apply -auto-approve" with the following environment variables
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

    Scenario: apply with azurerm with subscription service connection and subscription override
        Given terraform exists
        And terraform command is "apply"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub2                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm subscriptionId is "sub1"
        And running command "terraform apply -auto-approve" returns successful result
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform apply -auto-approve" with the following environment variables
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

    Scenario: apply without subscription id
        Given terraform exists
        And terraform command is "apply"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
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
        And running command "terraform apply -auto-approve" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform apply -auto-approve" with the following environment variables
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
        