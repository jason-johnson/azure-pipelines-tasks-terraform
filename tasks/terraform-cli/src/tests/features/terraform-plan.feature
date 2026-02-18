Feature: terraform plan

    terraform plan [options] [dir]

    Scenario: plan without service connection
        Given terraform exists
        And terraform command is "plan"
        And running command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: plan with azurerm
        Given terraform exists
        And terraform command is "plan"
        And azurerm service connection "dev" exists as
            | scheme         | serviceprincipal       |
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
        And running command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
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

    Scenario: plan with azurerm and command options
        Given terraform exists
        And terraform command is "plan" with options "-input=true -lock=false -no-color"
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
        And running command "terraform plan -input=true -lock=false -no-color -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform plan -input=true -lock=false -no-color -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
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

    Scenario: plan with azurerm and var file in command options
        Given terraform exists
        And terraform command is "plan" with options '-var-file="./default.vars"'
        And azurerm service connection "dev" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azure cli not exists
        And running command "terraform plan -var-file=./default.vars -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform plan -var-file=./default.vars -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_CLIENT_SECRET   | servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: plan with detailed exit code and changes present
        Given terraform exists
        And terraform command is "plan" with options "-input=true -lock=false -no-color -detailed-exitcode"
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
        And running command "terraform plan -input=true -lock=false -no-color -detailed-exitcode -out=tfplan-test.tfplan" returns successful result with exit code 2
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-with-changes.json"
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform plan -input=true -lock=false -no-color -detailed-exitcode -out=tfplan-test.tfplan" with the following environment variables
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
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "2"        
        And pipeline variable "TERRAFORM_PLAN_HAS_CHANGES" is set to "true"

    Scenario: plan with detailed exit code and no changes present
        Given terraform exists
        And terraform command is "plan" with options "-input=true -lock=false -no-color -detailed-exitcode"
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
        And running command "terraform plan -input=true -lock=false -no-color -detailed-exitcode -out=tfplan-test.tfplan" returns successful result with exit code 0
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run        
        Then the terraform cli task executed command "terraform plan -input=true -lock=false -no-color -detailed-exitcode -out=tfplan-test.tfplan" with the following environment variables
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
        And pipeline variable "TERRAFORM_PLAN_HAS_CHANGES" is set to "false"

    Scenario: plan with secure var file
        Given terraform exists        
        And terraform command is "plan"
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
        And running command "terraform plan -var-file=./src/tests/default.vars -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -var-file=./src/tests/default.vars -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
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

    Scenario: plan with secure env file
        Given terraform exists        
        And terraform command is "plan"
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
        And running command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
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

    Scenario: plan with invalid auth scheme
        Given terraform exists
        And terraform command is "plan"
        And azurerm service connection "dev" exists as
            | scheme         | foo       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And running command "terraform plan" returns successful result
        When the terraform cli task is run
        Then the terraform cli task fails with message "No matching authorization scheme was found. Terraform only supports service principal, managed service identity or workload identity federation authorization"

    Scenario: plan with empty auth scheme
        Given terraform exists
        And terraform command is "plan"
        And azurerm service connection "dev" exists as
            | scheme         |  |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And running command "terraform plan" returns successful result
        When the terraform cli task is run
        Then the terraform cli task fails with message "No matching authorization scheme was found. Terraform only supports service principal, managed service identity or workload identity federation authorization"

    Scenario: plan with azurerm and ManagedServiceIdentity auth scheme
        Given terraform exists
        And terraform command is "plan"
        And azurerm service connection "dev" exists as
            | scheme         | ManagedServiceIdentity       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
        And azure cli exists
        And running command "az login" with the following options returns successful result
            | option      |
            | --identity  |
        And task configured to run az login
        And running command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_USE_MSI         | true                   |
        And azure login is executed with the following options
            | option          |
            | --identity      |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: plan with azurerm and WorkloadIdentityFederation auth scheme
        Given terraform exists
        And terraform command is "plan"
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
        And running command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" returns successful result
        And running command "terraform show -json tfplan-test.tfplan" returns successful result with stdout from file "./src/tests/features/plan-show-no-changes.json"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform plan -out=tfplan-test.tfplan -detailed-exitcode" with the following environment variables
            | ARM_SUBSCRIPTION_ID | sub1                   |
            | ARM_TENANT_ID       | ten1                   |
            | ARM_CLIENT_ID       | servicePrincipal1      |
            | ARM_OIDC_TOKEN      | oidcToken1                   |
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