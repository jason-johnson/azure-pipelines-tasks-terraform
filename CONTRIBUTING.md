# Contributing

## CI/CD Pipeline

This project uses both GitHub Actions and Azure DevOps for CI/CD:

### GitHub Actions (for Pull Requests)
- **CI Workflow** (`.github/workflows/ci.yml`): Runs on all PRs and non-main branches
  - Builds and tests terraform-cli task with coverage
  - Builds and tests terraform-installer task
  - Builds and tests terraform-plan view with coverage
  - Packages the extension
  - Publishes test results and code coverage to pull requests

### Azure DevOps Pipelines (for Integration Testing and Publishing)
- **Main Pipeline** (`pipelines/main.yml`): Builds and publishes to private marketplace
- **Test Pipeline** (`pipelines/test.yml`): Runs integration tests that require Azure DevOps services

Integration tests must remain in Azure DevOps because they:
- Require the actual Azure DevOps task runtime environment
- Need Azure service connections and credentials
- Test the tasks in the context where they will be used

## Run Unit Tests for Terraform CLI Task

1. Navigate to `cd tasks\terraform-cli`.
1. Run `npm run test`.

## Build in VS Code with docker (including with Github Codespaces)

We have a devcontainer setup so you can run your development environment in Docker or in Github Codespaces.  If locally, you will be asked to restart in remote container.  To do this you'll need a local docker.  Otherwise you can just run the codespace directly from Github.

In either case, you should have everything required to build and test the project.

## Build Locally

1. Downgrade to node V6.
1. Ensure you have Python installed and in the path (e.g. `winget install python`).
1. Ensure you have C++ tools installed. See here https://github.com/nodejs/node-gyp#on-windows.
1. Navigate to the root folder.
1. If you haven't already, setup a https://marketplace.visualstudio.com/manage account and publisher following [these](https://learn.microsoft.com/en-us/azure/devops/extend/publish/overview?toc=%2Fazure%2Fdevops%2Fmarketplace-extensibility%2Ftoc.json&view=azure-devops#create-a-publisher) steps.
1. Create a file called `self.json` inside the root folder. The file contents should look like the following, but replace the `publisher` field with the publisher you setup earlier.
```json
{
    "name": "Terraform CLI (Dev - Individual)",
    "public": false,
    "publisher": "<replace-me-with-your-publisher>"
}
```
7. Run `npm run package:self`.
1. This will generate a `.vsix` file prefixed with your published name.
1. Navigate to your publisher portal: https://marketplace.visualstudio.com/manage/publishers
1. Choose your publisher and select  `New extension` and choose `Azure DevOps`.
1. You'll be prompted to drag and drop your `.vsix` file, do that and wait for it to be verified. Ensure you choose that your extension will be Private.
1. Click on the three dots `...` next to the extension name and choose `Share/Unshare`.
1. Click `+ Organization` and enter the name of your Azure DevOps org.
1. Now navigate to your Azure DevOps org and install the extension as you would any other.
1. You are now ready to use the extension and test it.