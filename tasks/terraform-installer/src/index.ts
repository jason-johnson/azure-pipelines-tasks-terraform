import * as tasks from 'azure-pipelines-task-lib/task';
import * as installer from './installer'
import * as tools from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import { resolveVersion } from './version-resolver';

async function configureTerraform(){
    var inputVersion = tasks.getInput("terraformVersion", false);
    var versionFile = tasks.getPathInput("terraformVersionFile", false);
    var downloadUrl = tasks.getInput("downloadUrl");
    
    // Validate that only one version input method is provided
    if (inputVersion && versionFile) {
        throw new Error("terraformVersion and terraformVersionFile are mutually exclusive. Please provide only one.");
    }
    
    // Determine the version to install
    let versionToInstall: string;
    if (versionFile) {
        console.log(`Using version constraint from file: ${versionFile}`);
        versionToInstall = await resolveVersion(versionFile, true);
    } else {
        // Default to 'latest' if neither input is provided
        const version = inputVersion || 'latest';
        console.log(`Using version input: ${version}`);
        versionToInstall = await resolveVersion(version, false);
    }
    
    console.log(`Installing Terraform version: ${versionToInstall}`);
    var terraformPath = await installer.download(versionToInstall, downloadUrl);
    var envPath = process.env['PATH'];
    if(envPath && !envPath.startsWith(path.dirname(terraformPath))){
        tools.prependPath(path.dirname(terraformPath));
    }
}

async function verifyTerraform(){
    console.log("Verifying Terraform installation. Executing 'terraform version'");
    var terraformToolPath = tasks.which("terraform", true);
    var terraformTool = tasks.tool(terraformToolPath);
    terraformTool.arg("version");
    return terraformTool.exec()
}

configureTerraform()
    .then(() => verifyTerraform())
    .then(() => {
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    })
    .catch((error) => {
        tasks.setResult(tasks.TaskResult.Failed, error)
    })