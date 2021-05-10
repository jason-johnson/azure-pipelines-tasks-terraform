# Terraform CLI for Azure Devops

This tasks enables running Terraform CLI commands from Azure Pipelines.

Terraform is required to exist on the build agent prior to running this task. See TerraformInstaller task within this repository to install terraform.

** If using hosted Ubuntu build agent, terraform installation should NOT be required as terraform is already installed on these agents.

## Development Setup

While not required, its strongly suggested to use Visual Studio Code. The repo includes configuration for executing tasks and debugging in Visual Studio Code

### Dependencies

The cli for Azure DevOps `tfx-cli` must be installed to upload the task and test in an Azure DevOps project.

```cmd
npm install -g tfx-cli
```

### Install NPM Packages

Ensure that your command line's current directory is set to the `tasks\terraform-cli` dir

```cmd
cd d:\code\azure-pipelines-terraform\tasks\terraform-cli
```

Run `npm install` to install the task dependencies.

```cmd
npm install
```

### Create environment file

In order to execute the task locally, a .env file needs to be created. The .env file will set the parameters that are typically set when editing the task in Build or Release pipeline. This file should be created within the root of the terraform-cli folder.

The example below contains all the possible inputs the task supports

```shell
# These indicate where the task will create installed tools and temp files
# These can remain as-is.
AGENT_TOOLSDIRECTORY=./../_test-agent/tools
AGENT_TEMPDIRECTORY=./../_test-agent/temp

# These settings are needed to access secure files that are uploaded to Pipelines > Library > Secure Files. 
# The connection handshake is currently happening when the task starts. 
# This means these settings currently have to be in place when running locally even if you did not specify a secure file
# The azure devops url to your target or (i.e. https://dev.azure.com/chzipp)
SYSTEM_TEAMFOUNDATIONCOLLECTIONURI=my-azure-devops-org-url
# The name of the project within the org provided above
SYSTEM_TEAMPROJECT=my-azure-devops-org-project
# A name for the stage under which the task is being executed. This can be any value. It does not have to match an actual stage in Azure Pipelines
SYSTEM_STAGENAME=test
# A name for the job under which the task is being executed. This can be any value. It does not have to match an actual job in Azure Pipelines
SYSTEM_JOBNAME=deploy
# Personal Access Token for authentication
ENDPOINT_AUTH_PARAMETER_SYSTEMVSSCONNECTION_ACCESSTOKEN=my-personal-access-token

# The command to execute
INPUT_COMMAND=init

# The path to the terraform templates to use when running the task
# The path provided will setup a resource group in azure and store state in azure storage
INPUT_WORKINGDIRECTORY=./../../templates/

# The path to the var file to use when executing the commands that require it
INPUT_COMMANDOPTIONS='-var-file default.vars'

# This can be left as is, this would the service connection name that points to the deployment target (i.e. azure subscription)
INPUT_ENVIRONMENTSERVICENAME=dev

# These specify the service principal credentials to use when executing plan and apply commands against azure.
ENDPOINT_AUTH_SCHEME_dev=ServicePrincipal
ENDPOINT_DATA_dev_SUBSCRIPTIONID=my-target-env-subscription-id
ENDPOINT_AUTH_PARAMETER_dev_TENANTID=my-target-env-tenant-id
ENDPOINT_AUTH_PARAMETER_dev_SERVICEPRINCIPALID=my-target-env-service-principal-app-id
ENDPOINT_AUTH_PARAMETER_dev_SERVICEPRINCIPALKEY=my-target-env-service-principal-key

# Indicates what type of terraform backend to use. Current valid values are 'local', 'azurerm'. 
INPUT_BACKENDTYPE=local

# If using 'azurerm' backend, this is the service name to the tfstate storage account's subscription
# This can be left as is
# INPUT_BACKENDSERVICEARM=backend

# If using 'azurerm' backend, these indicate the resource group, storage account name, container name, and file name used to store state.
# These are not required if using local backend
# INPUT_ENSUREBACKEND=true
# INPUT_BACKENDAZURERMRESOURCEGROUPNAME=my-resource-group-name-here
# INPUT_BACKENDAZURERMRESOURCEGROUPLOCATION=my-resource-group-location
# INPUT_BACKENDAZURERMSTORAGEACCOUNTNAME=my-storage-account-name
# INPUT_BACKENDAZURERMSTORAGEACCOUNTSKU=my-storage-account-sku
# INPUT_BACKENDAZURERMCONTAINERNAME=my-blob-container-name
# INPUT_BACKENDAZURERMKEY=my-blob-file-name

# If using 'azurerm' backend, these specify the service principal credentials to use when accessing the storage account
# These are not required if using local backend
# ENDPOINT_AUTH_SCHEME_backend=ServicePrincipal
# ENDPOINT_DATA_backend_SUBSCRIPTIONID=my-backend-subscription-id
# ENDPOINT_AUTH_PARAMETER_backend_TENANTID=my-backend-tenant-id
# ENDPOINT_AUTH_PARAMETER_backend_SERVICEPRINCIPALID=my-backend-service-principal-app-id
# ENDPOINT_AUTH_PARAMETER_backend_SERVICEPRINCIPALKEY=my-backend-service-principal-key
```

### Update main.tf Backend for Sample Template

If using the sample template within templates directory and using local backend, remove the section indicating remote azurerm backend

templates/main.tf

```tf
# comment this out if using local
terraform{
    backend "azurerm"{}
}
```

## Compile

The `npm run build` script will compile the typescript down to standard es6 javascript

```cmd
npm run build
```

## Run

The `npm start` script will compile the typescript and execute the task using the values specified in .env.

```cmd
npm start
```

## Test

The `npm test` script will compile the typescript and execute the unit tests.

```cmd
npm test
```

## Debug (Using Visual Studio Code)

From the Debug panel, set the configuration to `debug:tf cli` and press F5.
The following configurations have also been provided to support debugging other scenarios

- `debug:tests - tasks/terraform-cli` - Debug the unit tests.
- `debug:test - tasks/terraform-cli` - Debug a single test or subset of tests
    - Running this will prompt for search patter to select the tests to debug. See [Running Specific Features](https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md#running-specific-features) for what value to provide here. Providing `plan` would run all scenarios with `plan` in the name.

## Upload (To Azure DevOps)

The following will upload the task to an Azure DevOps account. This will allow for testing how the UI will present the group/input configuration in task.json. Additionally, this will allow for executing the task as part of a build and/or release pipeline within Azure DevOps.

Ensure the `tfx-cli` is logged into the target Azure DevOps account.

```cmd
tfx login
```

The `npm run upload` will upload the task to the current authorized Azure DevOps Org & Project.

The `tfx login` only needs to be executed once. After this is executed, `npm run upload` can be executed immediately.
