import * as tasks from 'azure-pipelines-task-lib/task';
import * as installer from './installer'
import * as tools from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';

async function configureTerraform(){
    var inputVersion = tasks.getInput("terraformVersion", true) || 'latest';
    var downloadUrl = tasks.getInput("downloadUrl");
    var terraformPath = await installer.download(inputVersion, downloadUrl);
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