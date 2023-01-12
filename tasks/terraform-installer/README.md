# Terraform Installer for Azure Devops

This tasks installs a specified version of terraform on the build agent.
** Hosted Ubuntu build agents already have terraform installed. This should only be needed for these agents a different version of terraform is required

## Development Setup
While not required, its strongly suggested to use Visual Studio Code. The repo includes configuration for executing tasks and debugging in Visual Studio Code
### Dependencies
The cli for Azure DevOps `tfx-cli` must be installed to upload the task and test in an Azure DevOps project.
```
npm install -g tfx-cli
```
### Install NPM Packages
Ensure that your command line's current directory is set to the TerraformInstaller dir
```
cd d:\code\azure-pipelines-tasks-terraform\tasks\terraform-installer
```
Run `npm install` to install the task dependencies.
```
npm install
```
### Create environment file
In order to execute the task locally, a .env file needs to be created. The .env file will set the parameters that are typically set when editing the task in Build or Release pipeline. This file should be created within the root of the TerrformInstaller folder.

The example below contains all the possible inputs the task supports

```shell
# These indicate where the task will create installed tools and temp files
# These can remain as-is. 
AGENT_TOOLSDIRECTORY=./../_test-agent/tools
AGENT_TEMPDIRECTORY=./../_test-agent/temp

# The version of terraform to install on the build agent
INPUT_TERRAFORMVERSION=0.14.3
```
## Compile
The `npm run build` script will compile the typescript down to standard es6 javascript
```
npm run build
```
## Run
The `npm start` script will compile the typescript and execute the task using the values specified in .env.
```
npm start
```
## Debug (Using Visual Studio Code)
From the Debug panel, set the configuration to `debug - tasks/terraform-installer` and press F5.
