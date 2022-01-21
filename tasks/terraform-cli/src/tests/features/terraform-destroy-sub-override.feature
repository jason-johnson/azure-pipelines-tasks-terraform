Feature: terraform destroy azurerm with subscription override

    terraform destroy [options] [dir]

    Scenario: destroy with azurerm with management group service connection and subscription override
        Given terraform exists
        And terraform command is "destroy"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm subscriptionId is "sub1"
        And running command "terraform destroy -auto-approve" returns successful result
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform destroy -auto-approve" with the following environment variables
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

    Scenario: destroy with azurerm with subscription service connection and subscription override
        Given terraform exists
        And terraform command is "destroy"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub2                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm subscriptionId is "sub1"
        And running command "terraform destroy -auto-approve" returns successful result
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option                    |
            | --service-principal       |
            | -t ten1                   |
            | -u servicePrincipal1      |
            | -p servicePrincipalKey123 |
        And task configured to run az login
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform destroy -auto-approve" with the following environment variables
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

    Scenario: destroy without subscription id
        Given terraform exists
        And terraform command is "destroy"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And running command "terraform destroy" returns successful result
        When the terraform cli task is run
        Then the terraform cli task fails with message "Unable to resolve subscription id. Subscription Id must be defined either on AzureRM Provider Service Connection with Subscription Id scope or, explicitly set in the `providerAzureRmSubscriptionId` input when using other scopes such as Management Group."