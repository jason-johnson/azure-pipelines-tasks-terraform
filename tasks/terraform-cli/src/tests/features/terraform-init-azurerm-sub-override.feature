Feature: terraform init azurerm with subscription override

  terraform init [options] [dir]

  Scenario: init with backend azurerm with subscription override on terraform 0.11.14
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v0.11.14\n\nYour version of Terraform is out of date! The latest version\nis 0.15.0. You can update by downloading from www.terraform.io/downloads.html\n"
    And azurerm backend service connection "backend" exists as
      | scheme       | ServicePrincipal       |
      | tenantId     | ten1                   |
      | clientId     | servicePrincipal1      |
      | clientSecret | servicePrincipalKey123 |
    And azurerm backend type selected with the following storage account
      | subscriptionId | sub2               |
      | resourceGroup  | rg-backend-storage |
      | name           | storage            |
      | container      | container          |
      | key            | master             |
    And running command "terraform init" with the following options returns successful result
      | option                                                   |
      | -backend-config=storage_account_name=storage             |
      | -backend-config=container_name=container                 |
      | -backend-config=key=master                               |
      | -backend-config=resource_group_name=rg-backend-storage   |
      | -backend-config=arm_subscription_id=sub2                 |
      | -backend-config=arm_tenant_id=ten1                       |
      | -backend-config=arm_client_id=servicePrincipal1          |
      | -backend-config=arm_client_secret=servicePrincipalKey123 |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                                   |
      | -backend-config=storage_account_name=storage             |
      | -backend-config=container_name=container                 |
      | -backend-config=key=master                               |
      | -backend-config=resource_group_name=rg-backend-storage   |
      | -backend-config=arm_subscription_id=sub2                 |
      | -backend-config=arm_tenant_id=ten1                       |
      | -backend-config=arm_client_id=servicePrincipal1          |
      | -backend-config=arm_client_secret=servicePrincipalKey123 |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: init with backend azurerm with subscription override on terraform 0.15.0
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v0.15.0\non windows_amd64\n+ provider registry.terraform.io/hashicorp/azurerm v2.53.0\n"
    And azurerm backend service connection "backend" exists as
      | scheme       | ServicePrincipal       |
      | tenantId     | ten1                   |
      | clientId     | servicePrincipal1      |
      | clientSecret | servicePrincipalKey123 |
    And azurerm backend type selected with the following storage account
      | subscriptionId | sub2               |
      | resourceGroup  | rg-backend-storage |
      | name           | storage            |
      | container      | container          |
      | key            | master             |
    And running command "terraform init" with the following options returns successful result
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    When the terraform cli task is run
    Then terraform is initialized with the following options
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: init with backend azurerm with subscription override ensured and storage account does not exist
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v0.15.0\non windows_amd64\n+ provider registry.terraform.io/hashicorp/azurerm v2.53.0\n"
    And azurerm backend service connection "backend" exists as
      | scheme       | ServicePrincipal       |
      | tenantId     | ten1                   |
      | clientId     | servicePrincipal1      |
      | clientSecret | servicePrincipalKey123 |
    And azurerm backend type selected with the following storage account
      | subscriptionId | sub2               |
      | resourceGroup  | rg-backend-storage |
      | name           | storage            |
      | container      | container          |
      | key            | master             |
    And azurerm ensure backend is checked with the following
      | location | eastus         |
      | sku      | Standard_RAGRS |
    And running command "terraform init" with the following options returns successful result
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    And azure cli exists
    And running command "az login" with the following options returns successful result
      | option                    |
      | --service-principal       |
      | -t ten1                   |
      | -u servicePrincipal1      |
      | -p=servicePrincipalKey123 |
    And running command "az account set -s sub2" returns successful result
    And running command "az group create --name rg-backend-storage --location eastus" returns successful result
    And running command "az storage account show --name storage --resource-group rg-backend-storage" fails with error "The Resource 'Microsoft.Storage/storageAccounts/storage' under resource group 'rg-backend-storage' was not found."
    And running command "az storage account create" with the following options returns successful result
      | option                              |
      | --name storage                      |
      | --resource-group rg-backend-storage |
      | --sku Standard_RAGRS                |
      | --kind StorageV2                    |
      | --encryption-services blob          |
      | --access-tier hot                   |
      | --allow-blob-public-access false    |
      | --https-only true                   |
      | --min-tls-version TLS1_2            |
    And running command "az storage container create --auth-mode login --name container --account-name storage" returns successful result
    When the terraform cli task is run
    Then an azure storage account is created with the following options
      | option                              |
      | --name storage                      |
      | --resource-group rg-backend-storage |
      | --sku Standard_RAGRS                |
      | --kind StorageV2                    |
      | --encryption-services blob          |
      | --access-tier hot                   |
      | --allow-blob-public-access false    |
      | --https-only true                   |
      | --min-tls-version TLS1_2            |
    And an azure storage container is created with the following options
      | option                 |
      | --auth-mode login      |
      | --name container       |
      | --account-name storage |
    And terraform is initialized with the following options
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    And terraform is initialized after ensure backend completes
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

  Scenario: init with backend azurerm with subscription override ensured and storage account exists
    Given terraform exists
    And terraform command is "init"
    And running command "terraform version" returns successful result with stdout "Terraform v0.15.0\non windows_amd64\n+ provider registry.terraform.io/hashicorp/azurerm v2.53.0\n"
    And azurerm backend service connection "backend" exists as
      | scheme       | ServicePrincipal       |
      | tenantId     | ten1                   |
      | clientId     | servicePrincipal1      |
      | clientSecret | servicePrincipalKey123 |
    And azurerm backend type selected with the following storage account
      | subscriptionId | sub2               |
      | resourceGroup  | rg-backend-storage |
      | name           | storage            |
      | container      | container          |
      | key            | master             |
    And azurerm ensure backend is checked with the following
      | location | eastus         |
      | sku      | Standard_RAGRS |
    And running command "terraform init" with the following options returns successful result
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    And azure cli exists
    And running command "az login" with the following options returns successful result
      | option                    |
      | --service-principal       |
      | -t ten1                   |
      | -u servicePrincipal1      |
      | -p=servicePrincipalKey123 |
    And running command "az account set -s sub2" returns successful result
    And running command "az group create --name rg-backend-storage --location eastus" returns successful result
    And running command "az storage account show --name storage --resource-group rg-backend-storage" returns successful result
    And running command "az storage account create" with the following options returns successful result
      | option                              |
      | --name storage                      |
      | --resource-group rg-backend-storage |
      | --sku Standard_RAGRS                |
      | --kind StorageV2                    |
      | --encryption-services blob          |
      | --access-tier hot                   |
      | --allow-blob-public-access false    |
      | --https-only true                   |
      | --min-tls-version TLS1_2            |
    And running command "az storage container create --auth-mode login --name container --account-name storage" returns successful result
    When the terraform cli task is run
    Then an azure storage account is not created
    And an azure storage container is created with the following options
      | option                 |
      | --auth-mode login      |
      | --name container       |
      | --account-name storage |
    And terraform is initialized with the following options
      | option                                                 |
      | -backend-config=storage_account_name=storage           |
      | -backend-config=container_name=container               |
      | -backend-config=key=master                             |
      | -backend-config=resource_group_name=rg-backend-storage |
      | -backend-config=subscription_id=sub2                   |
      | -backend-config=tenant_id=ten1                         |
      | -backend-config=client_id=servicePrincipal1            |
      | -backend-config=client_secret=servicePrincipalKey123   |
    And terraform is initialized after ensure backend completes
    And the terraform cli task is successful
    And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"