## NOTICE: PROJECT TRANSITIONED TO NEW OWNER

[@jason-johnson](https://github.com/jason-johnson) has taken over ownership of this extension. The previous publisher will no longer be creating updates for this extension so, going forward, please use the new publisher as described in this updated documentation.

# Azure Pipelines Extension for Terraform

![Build Status](https://dev.azure.com/azure-pipelines-terraform-rc/azure-pipelines-terraform-rc/_apis/build/status/jason-johnson.azure-pipelines-tasks-terraform?branchName=main)
![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/JasonBJohnson.azure-pipelines-tasks-terraform?label=marketplace%20installs)

This contains tasks for installing and executing Terraform commands from Azure Pipelines. These extensions are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure with Terraform from Azure Pipelines.

The tasks contained within this extension are:

- [Terraform Installer](/tasks/terraform-installer/README.md)
- [Terraform CLI](/tasks/terraform-cli/README.md)

This extension also contains views for the pipeline summary to help inspect actions performed by terraform.

The views contained within this extension are:

- [Terraform Plan](/views/terraform-plan/README.md)

## Telemetry Collection

The software may collect information about you and your use of the software and send to the repository owner. The repository owner may use this information to provide services and improve our products and services. You may turn off the telemetry as described below. 

### Disabling Telemetry Collection

Telemetry collection can be disabled by setting the `allowTelemetryCollection` property to `false`.

From classic pipeline editor, uncheck the `Allow Telemetry Collection` checkbox to disable
telemetry collection.

### Preferred Languages

We prefer all communications to be in English.

## For AI Agents and Contributors

If you're an AI agent or new contributor working on this repository, please see the [Agent Instructions](./.github/agents/instructions.md) for comprehensive guidance on:

- Repository structure and organization
- Build, test, and development workflows
- Code patterns and conventions
- Common development tasks
- CI/CD pipeline details
- MCP server for automation tools

The instructions will help you work more efficiently and follow project conventions.
