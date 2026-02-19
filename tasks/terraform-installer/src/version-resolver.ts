import * as semver from 'semver';
import * as fs from 'fs';
const fetch = require('node-fetch');
const hcl2Parser = require('hcl2-parser');

/**
 * Fetches all available Terraform versions from HashiCorp releases API
 * @returns Array of version strings sorted from newest to oldest
 */
export async function fetchAvailableTerraformVersions(): Promise<string[]> {
    console.log("Fetching available Terraform versions from HashiCorp...");
    
    try {
        const response = await fetch('https://releases.hashicorp.com/terraform/index.json');
        const data = await response.json();
        
        // Extract version numbers from the releases
        const versions = Object.keys(data.versions)
            .filter(v => {
                // Filter out pre-release versions (alpha, beta, rc)
                const version = data.versions[v];
                return !version.prerelease && semver.valid(v);
            })
            .sort((a, b) => semver.rcompare(a, b)); // Sort descending (newest first)
        
        console.log(`Found ${versions.length} available Terraform versions`);
        return versions;
    } catch (error) {
        throw new Error(`Failed to fetch Terraform versions: ${error}`);
    }
}

/**
 * Resolves a semver range to the latest matching version
 * @param range Semver range specification (e.g., "~>1.5.0", "^1.5.0", ">=1.5.0")
 * @returns The latest version matching the range
 */
export async function resolveSemverRange(range: string): Promise<string> {
    console.log(`Resolving semver range: ${range}`);
    
    // Normalize Terraform-style constraints to npm semver format
    // Terraform uses ~> for pessimistic constraint which is similar to npm's ~
    let normalizedRange = range.replace(/~>/g, '~');
    
    const versions = await fetchAvailableTerraformVersions();
    const matchingVersion = semver.maxSatisfying(versions, normalizedRange);
    
    if (!matchingVersion) {
        throw new Error(`No Terraform version found matching constraint: ${range}`);
    }
    
    console.log(`Resolved ${range} to version ${matchingVersion}`);
    return matchingVersion;
}

/**
 * Parses a Terraform configuration file and extracts the required_version constraint
 * @param filePath Path to the Terraform configuration file
 * @returns The version constraint string from required_version, or null if not found
 */
export function parseVersionConstraintFromFile(filePath: string): string | null {
    console.log(`Parsing version constraint from file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`Terraform configuration file not found: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
        const parsed = hcl2Parser.parseToObject(fileContent);
        
        // Navigate through the HCL structure to find terraform.required_version
        if (parsed && parsed.terraform && Array.isArray(parsed.terraform)) {
            for (const terraformBlock of parsed.terraform) {
                if (terraformBlock.required_version) {
                    const constraint = Array.isArray(terraformBlock.required_version) 
                        ? terraformBlock.required_version[0] 
                        : terraformBlock.required_version;
                    console.log(`Found required_version constraint: ${constraint}`);
                    return constraint;
                }
            }
        }
        
        console.log("No required_version constraint found in terraform block");
        return null;
    } catch (error) {
        throw new Error(`Failed to parse Terraform configuration file: ${error}`);
    }
}

/**
 * Resolves a version input that may be a version file path, semver range, or specific version
 * @param versionInput The version string or file path
 * @param isFilePath Whether the input is a file path
 * @returns A resolved specific version number
 */
export async function resolveVersion(versionInput: string, isFilePath: boolean = false): Promise<string> {
    if (isFilePath) {
        // Parse the file to get the constraint
        const constraint = parseVersionConstraintFromFile(versionInput);
        if (!constraint) {
            throw new Error(`No required_version constraint found in file: ${versionInput}`);
        }
        // Resolve the constraint to a specific version
        return await resolveSemverRange(constraint);
    }
    
    // Check if the input is a semver range
    if (semver.validRange(versionInput) && !semver.valid(versionInput)) {
        // It's a range, not a specific version
        return await resolveSemverRange(versionInput);
    }
    
    // It's either a specific version or 'latest' - let the existing logic handle it
    return versionInput;
}
