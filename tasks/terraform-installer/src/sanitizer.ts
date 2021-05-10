import { cleanVersion } from 'azure-pipelines-tool-lib';

export function sanitizeVersion(inputVersion: string) : string {
    var version = cleanVersion(inputVersion);
        if(!version){
            throw new Error("The input version '" + inputVersion + "' is not a valid semantic version");
        }
        return version;
}