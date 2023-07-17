# Contributing

## Run Unit Tests for Terraform CLI Task

1. Navigate to `cd tasks\terraform-cli`.
1. Run `npm run test`.

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