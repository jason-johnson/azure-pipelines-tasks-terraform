# Terraform Tasks for Azure Pipelines

## NOTICE: PROJECT IN TRANSFER

As of the start of 2022, Charles transitioned to a new role and could no longer commit to improving or maintaining this project going forward so it was transferred to Jason Johnson. This process is currently ongoing.

The tasks in this extension allow for running terraform cli commands from Azure Pipelines. The motivation for this extension was to provide terraform pipeline tasks that could execute on all build agent operating systems and provide guided task configuration.

## Supported Commands

The Terraform CLI task supports executing the following commands

- version
- init
- validate
- plan
- apply
- destroy
- show
- refresh
- import
- output
- force-unlock
- fmt
- workspace
- state

## Supported Public Cloud Providers

The Terraform CLI task support the following [Public Cloud](https://registry.terraform.io/browse/providers?category=public-cloud) providers

- azurerm
- aws
- google

> NOTE: It is possible to leverage other providers by providing configuration via environment variables using [secure files](#secure-variable-secrets) or, `-backend-config=key=value` within `commandOptions` input.

## Supported Backends

The Terraform CLI task supports the following terraform backends

- local
- azurerm
- aws
- gcs

> NOTE: It is possible to leverage other backends by providing configuration via environment variables using [secure files](#secure-variable-secrets) or, `-backend-config=key=value` within `commandOptions` input.

## Compatible with Linux Build Agents

The tasks can execute on all supported build agent operating systems **including Ubuntu and MacOS**.

## Separate Task for Terraform Installation

The dedicated `Terraform Installer` task allows for complete control over how frequently and on which agents terraform is installed. This prevents from having to install terraform before executing each terraform task. However, if necessary, this can be installed multiple times to support pipelines that span multiple build agents

### Install Latest Version

The installer task supports installing the latest terraform version by using the keyword `latest` as the version specified. This is the default option when the installer is added to a pipeline. Specifying latest will instruct the task to lookup and install the latest version of the terraform executable.

```yaml
- task: TerraformInstaller
  displayName: install terraform
  inputs:
    terraformVersion: latest
```

If `terraformVersion` not provided, task defaults to `latest`

```yaml
- task: TerraformInstaller
  displayName: install terraform
```

### Install Specific Version

```yaml
- task: TerraformInstaller
  displayName: install terraform
  inputs:
    terraformVersion: 0.14.3
```

## Check Terraform Version

The task supports running `terraform version` individually. When run, if the version is out of date, the task will log a warning to the pipeline summary if there is a newer version of terraform available.

```yaml
- task: TerraformCLI@0
  displayName: 'check terraform version'
  inputs:
    command: version
```

When running the other commands, `terraform version` is also run so that the version is recorded to the build log. However, warnings regarding out of date versions will be suppressed to reduce noise.

## Public Cloud Terraform Provider Integrations

The TerraformCLI task supports configuring the following public cloud providers. The task supports configuring multiple providers simultaneously to support multi-cloud deployments.

- azurerm - Authenticates via Azure Resource Manager Service Connection included within Azure DevOps.
- aws - Authenticates via AWS Service Connection made available via the [AWS Toolkit](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-vsts-tools) extension.
- google - Authenticates via service account JSON formatted key file uploaded to Azure DevOps secure files.

### Azure Service Connection / Service Principal Integration

When executing commands that interact with Azure such as `plan`, `apply`, and `destroy`, the task will utilize an Azure Service Connection to authorize operations against the target subscription. This is specified via the `environmentServiceName` input

```yaml
- task: TerraformCLI
  displayName: 'terraform apply'
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    # Subscription id for provider to target. This can be used to specify the subscription when using Management Group scoped
    # Service connection or to override the subscription id defined in a Subscription scoped service connection
    providerAzureRmSubscriptionId: 'my-backend-subscription-id'
```

#### Execute Azure CLI From Local-Exec Provisioner

When an azure service connection is provided and `runAzLogin` is set to `true`, the terraform cli task will run `az login` using the service connection credentials. This is intended to enable templates to execute az cli commands from a `local-exec` provisioner.

Setting `runAzLogin` to `true` will indicate the task should execute `az login` with specified service connection.

```yaml
- task: TerraformCLI
  displayName: 'terraform apply'
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    # indicate az login should be run as part of this command
    runAzLogin: true
```

Setting `runAzLogin` to `false` will indicate the task should not execute `az login` with specified service connection.

```yaml
- task: TerraformCLI
  displayName: 'terraform apply'
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    # indicate az login should be run as part of this command
    runAzLogin: true
```

`runAzLogin`  will default to `false` when not specified; indicating the task should NOT run `az login`

```yaml
- task: TerraformCLI
  displayName: 'terraform apply'
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    # indicate az login should be run as part of this command
    runAzLogin: true
```

This should allow the following template configuation to be run using this task

```terraform
resource "azurerm_storage_account" "st_core" {
  name                      = "my-storage-account"
  location                  = "eastus"
  resource_group_name       = azurerm_resource_group.rg_core.name
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "LRS"


  # can now be run by the terraform cli task from azure pipelines
  provisioner "local-exec" {
          command = "az storage blob service-properties update --account-name ${azurerm_storage_account.st_core.name} --static-website --index-document index.html --404-document index.html"
  }
}
```

### Amazon Web Services (AWS) Service Connection / IAM User Integration

When executing commands that interact with AWS such as `plan`, `apply`, and `destroy`, the task can utilize AWS Service Connection to authorize operations. This is specified via the `providerServiceAws` input. The region can also be provided via `providerAwsRegion` input.

```yaml
- task: TerraformCLI
  displayName: 'terraform apply'
  inputs:
    command: apply
    providerServiceAws: 'My AWS Service Connection'
    providerAwsRegion: us-east-1
```

> NOTE: This depends on the AWS Service Connection included with the [AWS Toolkit]([AWS Toolkit](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-vsts-tools) extension.

### Google Cloud Platform (GCP) Key File / Service Account Integration

When executing commands that interact with GCP such as `plan`, `apply`, and `destroy`, the task can utilize a JSON formatted key file uploaded to Azure DevOps Secure Files to authorize operations. This is specified via the `providerGoogleCredentials` input. This input should be the name of the secure file containing the JSON formatted key.

```yaml
- task: charleszipp.azure-pipelines-tasks-terraform.azure-pipelines-tasks-terraform-cli.TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    workingDirectory: $(test_templates_dir)
    # Google Credentials (i.e. for service account) in JSON file format in Azure DevOps Secure Files
    providerGoogleCredentials: gcp-service-account-key.json
    # The default project name where resources are managed. Defining project on a resource takes precedence over this.
    providerGoogleProject: gcs-trfrm-${{ parameters.stage }}-eus-czp
    # The default region where resources are managed. Defining region on a resource takes precedence over this.
    providerGoogleRegion: 'us-east-1'
```

### Configuring Other Cloud Providers

Other cloud providers can be configured using [secure env files](#secure-variable-secrets). See [`aws_self_configured.yml`](https://github.com/jason-johnson/azure-pipelines-tasks-terraform/blob/main/pipelines/test/aws_self_configured.yml) for example.

## Remote, Local and Self-configured Backend State Support

The task currently supports the following backend configurations

- local (default for terraform) - State is stored on the agent file system.
- azurerm - State is stored in a blob container within a specified Azure Storage Account.
- aws - State is stored in a S3 bucket
- gcs - State is stored in Google Cloud Storage bucket
- self-configured - State configuration will be provided using environment variables or command options. Environment files can be provided using Secure Files Library in AzDO and specified in Secure Files configuration field. Command options such as `-backend-config=` flag can be provided in the Command Options configuration field.

> NOTE: `self-configured` can be used to execute deployments for other cloud providers. See [`aws_self_configured.yml`](https://github.com/jason-johnson/azure-pipelines-tasks-terraform/blob/main/pipelines/test/aws_self_configured.yml) for example.

### AzureRM

If azurerm selected, the task will prompt for a service connection and storage account details to use for the backend. *The task supports both Subscription and Management Group scoped service connections*

```yaml
- task: TerraformCLI
  displayName: 'terraform init'
  inputs:
    command: init
    backendType: azurerm
    # Service connection to authorize backend access. Supports Subscription & Management Group Scope
    backendServiceArm: 'My Azure Service Connection'
    # Subscription id of the target backend. This can be used to specify the subscription when using Management Group scoped
    # Service connection or to override the subscription id defined in a Subscription scoped service connection
    backendAzureRmSubscriptionId: 'my-backend-subscription-id'
    # create backend storage account if doesn't exist
    ensureBackend: true
    backendAzureRmResourceGroupName: 'my-backend-resource-group'
    # azure location shortname of the backend resource group and storage account
    backendAzureRmResourceGroupLocation: 'eastus'
    backendAzureRmStorageAccountName: 'my-backend-storage-account'
    # azure storage account sku, used when creating the storage account
    backendAzureRmStorageAccountSku: 'Standard_RAGRS'
    # azure blob container to store the state file
    backendAzureRmContainerName: 'my-backend-blob-container'
    # azure blob file name
    backendAzureRmKey: infrax.tfstate
```

#### Automated Remote Backend Creation for Azure Storage

The task supports automatically creating the resource group, storage account, and container for remote azurerm backend. To enable this, set the `ensureBackend` input to `true` and provide the resource group, location, and storage account sku. The defaults are 'eastus' and 'Standard_RAGRS' respectively. The task will utilize AzureCLI to create the resource group, storage account, and container as specified in the backend configuration.

### AWS S3

If aws selected, the task allows for configuring a service connection as well as the bucket details to use for the backend.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform init'
  inputs:
    command: init
    workingDirectory: $(my_terraform_templates_dir)
    # set to `aws` to use aws backend
    backendType: aws
    # service connection name, required if backendType = aws
    backendServiceAws: env_test_aws
    # s3 bucket's region, optional if provided elsewhere (i.e. inside terraform template or command options)
    backendAwsRegion: us-east-1
    # s3 bucket name, optional if provided elsewhere (i.e. inside terraform template or command options)
    backendAwsBucket: s3-trfrm-dev-eus-czp
    # s3 path to state file, optional if provided elsewhere (i.e. inside terraform template or command options)
    backendAwsKey: 'my-env-infrax/dev-infrax'
```

### Google Cloud Storage Bucket

If gcp selected, the task allows for defining gcs backend configuration. The authentication is done via a key in json file format provided by Google Cloud IAM. The key file can be uploaded to Secure Files in Azure DevOps and referenced from the task. The task will then use the key file for authentication.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform init'
  inputs:
    command: init
    workingDirectory: $(test_templates_dir)
    backendType: gcs
    # Google Credentials (i.e. for service account) in JSON file format in Azure DevOps Secure Files
    backendGcsCredentials: gcs-backend-key.json
    # GCS bucket name
    backendGcsBucket: gcs-trfrm-alpha-eus-czp
    # GCS Bucket path to state file
    backendGcsPrefix: 'azure-pipelines-terraform/infrax'
```

## Secure Variable Secrets

There are multiple methods to provide secrets within the vars provided to terraform commands. The `commandOptions` input can be used to specify individual `-var` inputs. When using this approach pipeline variables can be used as `-var secret=$(mySecretPipelineVar)`. Additionally, either a terraform variables file or a env file secured in Secure Files Library of Azure DevOps pipeline can be specified. Storing sensitive var and env files in the Secure Files Library not only provides encryption at rest, it also allows the files to have different access control applied than that of the Source Repository and Build/Release Pipelines.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    environmentServiceName: 'My Azure Service Connection'
    # guid of the secure file to use. Can be standard terraform vars file or .env file.
    secureVarsFile: 446e8878-994d-4069-ab56-5b302067a869
    # specify a variable input via pipeline variable
    commandOptions: '-var secret=$(mySecretPipelineVar)'
```

The name of the secure file can also be used.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    environmentServiceName: 'My Azure Service Connection'
    # name of the secure file to use. Can be standard terraform vars file or .env file.
    secureVarsFile: my-secure-file.env
    # specify a variable input via pipeline variable
    commandOptions: '-var secret=$(mySecretPipelineVar)'
```

### Secure Env Files

If the Secure Variables file name is `*.env`, it is referred as `.env` file. This task loads environment variables from the `.env` file.

#### _.env file example_

```bash
KEY1=VALUE1
KEY2=VALUE2
```

## Terraform Output to Pipeline Variables

The TerraformCLI task supports running the Terraform `output` command. When this is run, pipeline variables will be created from each output variable emitted from the `terraform output` command. Sensitive variables will be set as secret pipeline variables and their values will not be emitted to the pipeline logs.

For example, an output variable named `some_string`  will set a pipeline variable named `TF_OUT_SOME_STRING`.

This feature currently only supports primitive types `string`, `bool`, and `number`. Complex typed outputs such as `tuple` and `object` will be excluded from the translation.

Template has output defined

```tf
output "some_string" {
  sensitive = false
  value = "somestringvalue"
}

output "some_sensitive_string" {
  sensitive = true
  value = "some-string-value"
}
```

Pipeline configuration to run terraform `output` command

```yaml
- task: TerraformCLI@0
  displayName: 'terraform output'
  inputs:
    command: output
    # ensure working directory targets same directory as apply step
    # if not specified $(System.DefaultWorkingDirectory) will be used
    # workingDirectory: $(my_terraform_templates_dir)
```

> NOTE: `workingDirectory` must be set to the same working directory that is used to execute other operations such as `apply`. The default for `workingDirectory` is `$(System.DefaultWorkingDirectory)` when not specified.

Use output variables as pipeline variables

```yaml
- bash: |
    echo 'some_string is $(TF_OUT_SOME_STRING)'
    echo 'some_sensitive_string is $(TF_OUT_SOME_SENSITIVE_STRING)'
  displayName: echo tf output vars
```

> **Note that `$(TF_OUT_SOME_SENSITIVE_STRING)` will be redacted as `***` in the pipeline logs.**

## Terraform Plan View

The extension includes a feature to render terraform plans within the pipeline run summary. To use this feature the `publishPlanResults` input must be provided when running `terraform plan` via the `TerraformCLI` task. The input should be set to the name that should be assigned to the plan (however, do not use the name of a subfolder in the working directory).

> **Important** - When enabling `publishPlanResults` the `-detailed-exitcode` option will be added when running terraform plan if it was not already provided in the `commandOptions` input. This will cause `TERRAFORM_LAST_EXITCODE` to be `2` when plan includes changes; which is a successful exitcode. Additionally, warnings will be logged to the pipeline summary when changes are present as a means to alert that changes will be made if the templates are applied.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    environmentServiceName: 'My Azure Service Connection'
    publishPlanResults: 'my_plan_name'
```

![Terraform Plan View Has Results](https://raw.githubusercontent.com/jason-johnson/azure-pipelines-tasks-terraform/main/screenshots/overview-tfplan-view.jpg)

If the `publishPlanResults` input is not provided, then no plans will be published. In this case, the view will render empty with a message indicating no plans were found.

![Terraform Plan View No Results](https://raw.githubusercontent.com/jason-johnson/azure-pipelines-tasks-terraform/main/screenshots/overview-tfplan-view-no-plans.jpg)

> **Note The name set on `publishPlanResults` is only used for rendering in the view. It does not cause the cli to implicitly save plan output on the agent with that name.

## Terraform Plan Change Detection

When running terraform plan with `-detailed-exitcode`, a pipeline variable will be set to indicate if any changes exist in the plan. `TERRAFORM_PLAN_HAS_CHANGES` will be set to `true` if plan detected changes. Otherwise, this variable will be set to `false`. This can be used in conjunction with `Custom Condition` expression under `Control Options` tab of the task to skip terraform apply if no changes were detected.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    environmentServiceName: 'My Azure Service Connection'
    commandOptions: '-out=$(System.DefaultWorkingDirectory)/terraform.tfplan -detailed-exitcode'
```

Run apply only if changes are detected.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform apply'
  condition: and(succeeded(), eq(variables['TERRAFORM_PLAN_HAS_CHANGES'], 'true'))
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    commandOptions: '$(System.DefaultWorkingDirectory)/terraform.tfplan'
```

## Terraform Plan Destroy Detection

The task now has the ability to set a pipeline variable `TERRAFORM_PLAN_HAS_DESTROY_CHANGES` if a generated plan has destroy operations. To utilize this, run terraform plan and set the `-out=my-plan-file-path` to write the generated plan to a file. Then run `terraform show` and provide the path to the generated plan file in the `Target Plan or State File Path` input field. If show, detects a destroy operation within the plan file, then the pipeline variable `TERRAFORM_PLAN_HAS_DESTROY_CHANGES` will be set to true.

```yaml
- task: TerraformCLI@0
  displayName: 'terraform plan'
  inputs:
    command: plan
    environmentServiceName: 'My Azure Service Connection'
    commandOptions: '-out=$(System.DefaultWorkingDirectory)/terraform.tfplan'
```

Run show to detect destroy operations

```yaml
- task: TerraformCLI@0
  displayName: 'terraform show'
  inputs:
    command: show
    inputTargetPlanOrStateFilePath: '$(System.DefaultWorkingDirectory)/terraform.tfplan'
```

Skip apply if destroy operations

```yaml
- task: TerraformCLI@0
  displayName: 'terraform apply'
  condition: and(succeeded(), eq(variables['TERRAFORM_PLAN_HAS_DESTROY_CHANGES'], 'false'))
  inputs:
    command: apply
    environmentServiceName: 'My Azure Service Connection'
    commandOptions: '$(System.DefaultWorkingDirectory)/terraform.tfplan'
```

## Workspaces

The task supports managing workspaces within pipelines. The following workspace subcommands are supported.

### Workspace Select

```yaml
- task: TerraformCLI@0
  displayName: select workspace foo
  inputs:
    workingDirectory: $(terraform_templates_dir)
    command: workspace
    workspaceSubCommand: select
    workspaceName: foo
```

### Workspace New

```yaml
- task: TerraformCLI@0
  displayName: select workspace foo
  inputs:
    workingDirectory: $(terraform_templates_dir)
    command: workspace
    workspaceSubCommand: new
    workspaceName: foo
```

## **Importing resources**

The task supports importing existing resources.

### Import

```yaml
- task: TerraformCLI@0
  displayName: 'terraform import env'
  inputs:
    command: import
    workingDirectory: $(terraform_templates_dir)
    resourceAddress: azurerm_resource_group.myrg  # The resource type and name in your .tf file
    resourceId: "/subscriptions/000-...-0000/resourceGroups/MyRG"  # The Azure object id for the Resource Group (see with `az group list` in Powershell)
```

## **State Management**

The task supports managing state within pipelines. The following state subcommands are supported.

### State List

```yaml
- task: TerraformCLI@0
  diplayName: 'terraform state list'
  inputs:
    command: state
    workingDirectory: $(terraform_templates_dir)
    stateSubCommand: list
    stateSubCommandAddresses: module.my_module
```

### State Move

```yaml
- task: TerraformCLI@0
  diplayName: 'terraform state mv'
  inputs:
    command: state
    workingDirectory: $(terraform_templates_dir)
    stateSubCommand: mv
    stateMoveSource: azurerm_resource_group.myrg
```

### State Remove

```yaml
- task: TerraformCLI@0
  diplayName: 'terraform state rm'
  inputs:
    command: state
    workingDirectory: $(terraform_templates_dir)
    stateSubCommand: rm
    stateSubCommandAddresses: azurerm_resource_group.myrg,azurerm_resource_group.yourrg
```

### Force Unlock

```yaml
- task: TerraformCLI@
  displayName: 'terraform force-unlock'
  inputs:
    command: forceunlock
    lockID: '6b49ea93-d4bb-6d06-4a88-63189f162bf7'