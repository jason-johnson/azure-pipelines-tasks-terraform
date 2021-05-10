Feature: terraform force-unlock

    terraform force-unlock [options] [lockID]

    Scenario: force-unlock with azurerm
        Given terraform exists
        And terraform command is "forceunlock"
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
        And force-unlock is run with lock id "3ea12870-968e-b9b9-cf3b-f4c3fbe36684"
        And running command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" with the following environment variables
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

    Scenario: force-unlock with secure env file
        Given terraform exists
        And terraform command is "forceunlock"
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli not exists
        And force-unlock is run with lock id "3ea12870-968e-b9b9-cf3b-f4c3fbe36684"        
        And secure file specified with id "6b4ef608-ca4c-4185-92fb-0554b8a2ec72" and name "./src/tests/default.env"
        And running command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform force-unlock -force 3ea12870-968e-b9b9-cf3b-f4c3fbe36684" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
            | TF_VAR_app-short-name | tffoo  |
            | TF_VAR_region         | eastus |
            | TF_VAR_env-short-name | dev    |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"