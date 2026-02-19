import * as semver from 'semver';
import * as fs from 'fs';
import * as path from 'path';
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
                // Filter out pre-release versions (alpha, beta, rc) using semver
                const parsed = semver.parse(v);
                return parsed && parsed.prerelease.length === 0;
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
 * Finds all .tf files in a directory (non-recursive)
 * @param dirPath Path to the directory
 * @returns Array of full paths to .tf files
 */
function findTerraformFiles(dirPath: string): string[] {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        return entries
            .filter(entry => entry.isFile() && entry.name.endsWith('.tf'))
            .map(entry => path.join(dirPath, entry.name));
    } catch (error) {
        throw new Error(`Failed to read directory ${dirPath}: ${error}`);
    }
}

/**
 * Parses a single Terraform file and extracts the required_version constraint
 * @param filePath Path to a single Terraform configuration file
 * @returns The version constraint string from required_version, or null if not found
 */
function parseVersionConstraintFromSingleFile(filePath: string): string | null {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
        const parsed = hcl2Parser.parseToObject(fileContent);
        
        // The parser returns an array where the first element contains the parsed object
        const parsedData = Array.isArray(parsed) ? parsed[0] : parsed;
        
        // Navigate through the HCL structure to find terraform.required_version
        if (parsedData && parsedData.terraform && Array.isArray(parsedData.terraform)) {
            for (const terraformBlock of parsedData.terraform) {
                if (terraformBlock.required_version) {
                    const constraint = Array.isArray(terraformBlock.required_version) 
                        ? terraformBlock.required_version[0] 
                        : terraformBlock.required_version;
                    return constraint;
                }
            }
        }
        
        return null;
    } catch (error) {
        // Log but don't throw - this file might not have the constraint
        console.log(`Could not parse ${path.basename(filePath)}: ${error}`);
        return null;
    }
}

/**
 * Parses a Terraform configuration file or directory and extracts the required_version constraint
 * @param pathInput Path to a Terraform configuration file or directory
 * @returns The version constraint string from required_version, or null if not found
 */
export function parseVersionConstraintFromFile(pathInput: string): string | null {
    console.log(`Parsing version constraint from: ${pathInput}`);
    
    if (!fs.existsSync(pathInput)) {
        throw new Error(`Terraform configuration path not found: ${pathInput}`);
    }
    
    const stats = fs.statSync(pathInput);
    
    if (stats.isDirectory()) {
        console.log(`Path is a directory, searching for .tf files...`);
        const tfFiles = findTerraformFiles(pathInput);
        
        if (tfFiles.length === 0) {
            throw new Error(`No .tf files found in directory: ${pathInput}`);
        }
        
        console.log(`Found ${tfFiles.length} .tf file(s) in directory`);
        
        // Try to parse each file until we find a required_version constraint
        for (const tfFile of tfFiles) {
            console.log(`  Checking ${path.basename(tfFile)}...`);
            const constraint = parseVersionConstraintFromSingleFile(tfFile);
            if (constraint) {
                console.log(`Found required_version constraint in ${path.basename(tfFile)}: ${constraint}`);
                return constraint;
            }
        }
        
        console.log("No required_version constraint found in any .tf file");
        return null;
    } else {
        // It's a single file
        console.log(`Path is a file, parsing...`);
        const constraint = parseVersionConstraintFromSingleFile(pathInput);
        if (constraint) {
            console.log(`Found required_version constraint: ${constraint}`);
        } else {
            console.log("No required_version constraint found in file");
        }
        return constraint;
    }
}

/**
 * Resolves a version input that may be a file/directory path, semver range, or specific version
 * @param versionInput The version string, file path, or directory path
 * @param isFilePath Whether the input is a file or directory path
 * @returns A resolved specific version number
 */
export async function resolveVersion(versionInput: string, isFilePath: boolean = false): Promise<string> {
    if (isFilePath) {
        // Parse the file or directory to get the constraint
        const constraint = parseVersionConstraintFromFile(versionInput);
        if (!constraint) {
            throw new Error(`No required_version constraint found in: ${versionInput}`);
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
