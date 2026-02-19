import { cleanVersion } from 'azure-pipelines-tool-lib';
import * as semver from 'semver';

export function sanitizeVersion(inputVersion: string) : string {
    // First try to clean it as a specific version
    var version = cleanVersion(inputVersion);
    if(version){
        return version;
    }
    
    // If cleanVersion fails, it might be a semver range
    // Normalize Terraform-style constraints to npm semver format
    const normalizedVersion = inputVersion.replace(/~>/g, '~');
    
    // Check if it's a valid semver range
    if(semver.validRange(normalizedVersion)){
        // Return the original input for range processing
        return inputVersion;
    }
    
    // If neither a valid version nor a valid range, throw error
    throw new Error("The input version '" + inputVersion + "' is not a valid semantic version or version range");
}