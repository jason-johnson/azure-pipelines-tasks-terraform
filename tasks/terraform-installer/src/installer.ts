import * as tasks from 'azure-pipelines-task-lib/task';
import { sanitizeVersion } from './sanitizer'
import { resolveSemverRange } from './version-resolver'
import * as tools from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { format } from 'util';
import * as semver from 'semver';
const uuidV4 = require('uuid/v4');
const fetch = require('node-fetch');
const terraformToolName = "terraform";

export async function download(inputVersion: string, downloadUrl: string | undefined): Promise<string>{
    var latestVersion: string = "";

    if(inputVersion.toLowerCase() === 'latest') {
        console.log("Getting latest version");
        await fetch('https://checkpoint-api.hashicorp.com/v1/check/terraform')
            .then((response: { json: () => any; }) => response.json())
            .then((data: { [x: string]: any; }) => {
                latestVersion = data.current_version;
            })
            .catch((err: any) => {
                throw new Error(`Unable to retrieve latest version: ${err}`)
            })
    }
    
    var resolvedVersion = latestVersion != "" ? latestVersion : inputVersion;
    
    // Check if the version is a semver range and resolve it
    const normalizedVersion = resolvedVersion.replace(/~>/g, '~');
    if (semver.validRange(normalizedVersion) && !semver.valid(resolvedVersion)) {
        console.log(`Detected semver range: ${resolvedVersion}`);
        resolvedVersion = await resolveSemverRange(resolvedVersion);
        console.log(`Resolved to version: ${resolvedVersion}`);
    }
    
    var version = sanitizeVersion(resolvedVersion);
    var cachedToolPath = tools.findLocalTool(terraformToolName, version);
    if(!cachedToolPath){
        const url = downloadUrl || getDownloadUrl(version)
        console.log("Terraform not installed, downloading from: ", url);
        var fileName = `${terraformToolName}-${version}-${uuidV4()}.zip`;
        console.log("Terraform file name as: ", fileName);
        try{
            var downloadPath = await tools.downloadTool(url, fileName);
            console.log("Terraform downloaded to path: ", downloadPath);
        }
        catch (exception){
            throw new Error(`Terraform download from url '${url}' failed with exception '${exception}'`);
        }

        var unzippedPath = await tools.extractZip(downloadPath);
        console.log("Extracted terraform to dir: ", unzippedPath);
        cachedToolPath = await tools.cacheDir(unzippedPath, terraformToolName, version);
        console.log("Terraform installed in path: ", cachedToolPath);
    }

    var terraformPath = findTerraform(cachedToolPath);
    if(!terraformPath){
        throw new Error(`Unable to resolve path to Terraform tool using root '${cachedToolPath}'.`)
    }
    fs.chmodSync(terraformPath, "777");
    return terraformPath;
}

function findTerraform(rootFolder: string) {
    console.log("Resolving path to Terraform tool...");
    var terraformPath = path.join(rootFolder, terraformToolName + getExecutableExtension());
    console.log("Expected Terraform path: ", terraformPath)
    var allPaths = tasks.find(rootFolder);
    console.log("Searching the following paths: ", allPaths);
    var matchingResultsFiles = tasks.match(allPaths, terraformPath, rootFolder);
    console.log("Matched files: ", matchingResultsFiles);
    return matchingResultsFiles[0];
}

function getDownloadUrl(version: string): string {
    var url = format("https://releases.hashicorp.com/terraform/%s/terraform_%s_%s_amd64.zip", version, version);
    switch(os.type()){
        case 'Linux':
            return format(url, "linux");
        case 'Darwin':
            return format(url, "darwin");
        case 'Windows_NT':
            return format(url, "windows");
        default:
            throw new Error(`Operating system ${os.type()} is not supported.`);
    }
}

function getExecutableExtension(): string {
    if (os.type().match(/^Win/)) {
        return ".exe";
    }

    return "";
}
