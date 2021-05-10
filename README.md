# Azure Pipelines Extension for Terraform

## NOTE: REPO RECENTLY RECREATED

This repo has recently been recreated to correct a source control issue. Please be sure to do the following:

- Update any clones to use this repo.
- Recreate any forks based on this repo. This was recreated as of 0.6.21 tag of the original repo
- Re-star the repository

[![Build Status](https://dev.azure.com/azure-pipelines-terraform-rc/azure-pipelines-terraform-rc/_apis/build/status/azure-pipelines-tasks-terraform-rc?branchName=main)](https://dev.azure.com/azure-pipelines-terraform-rc/azure-pipelines-terraform-rc/_build/latest?definitionId=1&branchName=main)
![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/charleszipp.azure-pipelines-tasks-terraform?label=marketplace%20installs)

This contains tasks for installing and executing Terraform commands from Azure Pipelines. These extensions are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure with Terraform from Azure Pipelines.

The tasks contained within this extension are:

- [Terraform Installer](/tasks/terraform-installer/README.md)
- [Terraform CLI](/tasks/terraform-cli/README.md)

This extension also contains views for the pipeline summary to help inspect actions performed by terraform.

The views contained within this extension are:

- [Terraform Plan](/views/terraform-plan/README.md)

### Disabling Telemetry Collection

Telemetry collection can be disabled by setting the `allowTelemetryCollection` property to `false`.

From classic pipeline editor, uncheck the `Allow Telemetry Collection` checkbox to disable
telemetry collection.

### Preferred Languages

We prefer all communications to be in English.
