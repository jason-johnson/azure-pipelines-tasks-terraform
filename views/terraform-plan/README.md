# Terraform Plan View

This view enabled quick inspection of terraform plans produced by a Azure Pipeline run. 
The view is a simple React web page.
It is compiled with Webpack and is shown to the user inside of an Azure DevOps Build Pipeline if the Terraform extension is used.

## Development Setup

While not required, its strongly suggested to use Visual Studio Code. The repo includes configuration for executing tasks and debugging in Visual Studio Code

### Dependencies

- [VS Code Debugger For Edge](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-edge) - Used in launch configurations that require a browser.

### Working Directory

For the following, ensure that your command line's current directory is set to the `views\terraform-plan` dir

```cmd
cd d:\code\azure-pipelines-terraform\tasks\terraform-cli
```

### Install NPM Packages

Run `npm install` to install the task dependencies.

```cmd
npm install
```

## Compile

The `npm run build` script will execute `webpack` to compile and bundle the React app

```cmd
npm run build
```

## Run

The `npm start` script open the webpack dev server and serve content from `views\terraform-plan\.bin\` at `http://localhost:3000`

```cmd
npm start
```

**Note**: This will not immediately open a browser. After starting open browser and navigate to `http://localhost:3000`

## Debug (Using Visual Studio Code)

From the Debug panel, set the configuration to `debug - views/terraform-plan` and press F5.

This launch config will automatically start the webpack dev server and open chrome window with debugger attached at port 9222.

The following configurations have also been provided to support debugging tests

- `debug:tests - views/terraform-plan` - Runs jest with debugger attached.

## Test

The `npm run test` script will execute all unit tests using jest.

```cmd
npm run test
```

Tests can also be debugged in VS Code using launch configuration `debug:tests - views/terraform-plan`.

## Pack

The `npm pack` will copy files required by overall extension to `views\terraform-plan\.dist` directory.

```cmd
npm run pack
```