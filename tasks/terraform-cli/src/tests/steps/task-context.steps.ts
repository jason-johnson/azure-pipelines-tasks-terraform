import { binding, given, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { MockTaskContext } from '../../context';
import { DataTable } from '@cucumber/cucumber'
import { BackendTypes } from '../../backends';
import util from "util";

@binding([MockTaskContext])
export class TaskContextSteps {
    constructor(private ctx: MockTaskContext) { }    
    
    @given("terraform command is {string}")
    public inputTerraformCommand(command: string){
        this.ctx.name = command;
    }

    @given("terraform command is {string} with options {string}")
    public inputTerraformCommandWithOptions(command: string, commandOptions: string){
        this.ctx.name = command;
        this.ctx.commandOptions = commandOptions;
    }

    @given("secure file specified with id {string} and name {string}")
    public inputTerraformSecureVarsFile(id: string, name: string){
        this.ctx.secureVarsFileId = id;
        this.ctx.secureVarsFileName = name;
        process.env[`SECUREFILE_NAME_${id}`] = name;
    }
    
    @given("gcs backend credential file specified with id {string} and name {string}")
    public inputGcpCredentialFileFile(id: string, name: string){
        this.ctx.backendGcsCredentials = id;
        process.env[`SECUREFILE_NAME_${id}`] = name;
    }
    
    @given("azurerm backend service connection {string} exists as")
    public inputAzureRmBackendServiceEndpoint(backendServiceName: string, table: DataTable){
        var endpoint = table.rowsHash();        
        this.ctx.backendServiceArm = backendServiceName;
        this.ctx.backendServiceArmAuthorizationScheme = endpoint.scheme;
        this.ctx.backendServiceArmClientId = endpoint.clientId;
        this.ctx.backendServiceArmClientSecret = endpoint.clientSecret;
        this.ctx.backendServiceArmSubscriptionId = endpoint.subscriptionId;
        this.ctx.backendServiceArmTenantId = endpoint.tenantId;
    }

    @given("aws backend service connection {string} exists as")
    public inputAwsBackendServiceEndpoint(backendServiceName: string, table: DataTable){
        var endpoint = table.rowsHash();        
        this.ctx.backendServiceAws = backendServiceName;
        this.ctx.backendServiceAwsAccessKey = endpoint.username;
        this.ctx.backendServiceAwsSecretKey = endpoint.password;
    }

    @given("aws provider service connection {string} exists as")
    public inputAwsProviderServiceEndpoint(providerServiceName: string, table: DataTable){
        var endpoint = table.rowsHash();        
        this.ctx.providerServiceAws = providerServiceName;
        this.ctx.providerServiceAwsAccessKey = endpoint.username;
        this.ctx.providerServiceAwsSecretKey = endpoint.password;
    }

    @given("aws provider region is configured as {string}")
    public inputAwsProviderRegion(providerAwsRegion: string){
        this.ctx.providerAwsRegion = providerAwsRegion;
    }

    @given("azurerm service connection {string} exists as")
    public inputAzureRmServiceEndpoint(environmentServiceName: string, table: DataTable){
        var endpoint = table.rowsHash();        
        this.ctx.environmentServiceName = environmentServiceName;
        this.ctx.environmentServiceArmAuthorizationScheme = endpoint.scheme;
        this.ctx.environmentServiceArmClientId = endpoint.clientId;
        this.ctx.environmentServiceArmClientSecret = endpoint.clientSecret;
        this.ctx.environmentServiceArmSubscriptionId = endpoint.subscriptionId;
        this.ctx.environmentServiceArmTenantId = endpoint.tenantId;
    }

    @given("azurerm backend type selected with the following storage account")
    public inputAzureRmBackend(table: DataTable){
        var backend = table.rowsHash();
        this.ctx.backendType = BackendTypes.azurerm;
        this.ctx.backendAzureRmSubscriptionId = backend.subscriptionId;
        this.ctx.backendAzureRmResourceGroupName = backend.resourceGroup;
        this.ctx.backendAzureRmStorageAccountName = backend.name;
        this.ctx.backendAzureRmContainerName = backend.container;
        this.ctx.backendAzureRmKey = backend.key;
    }

    @given("aws backend type selected with the following bucket")
    public inputAwsBackend(table: DataTable){
        var backend = table.rowsHash();
        this.ctx.backendType = BackendTypes.aws;
        this.ctx.backendAwsBucket = backend.bucket;
        this.ctx.backendAwsKey = backend.key;
        this.ctx.backendAwsRegion = backend.region;
    }

    @given("gcs backend type selected with the following bucket")
    public inputGcsBackend(table: DataTable){
        var backend = table.rowsHash();
        this.ctx.backendType = BackendTypes.gcs;
        this.ctx.backendGcsBucket = backend.bucket;
        this.ctx.backendGcsPrefix = backend.prefix;
    }

    @given("aws backend type selected without bucket configuration")
    public inputAwsBackendWithoutBucketConfiguration(){
        this.ctx.backendType = BackendTypes.aws;
    }

    @given("self-configured backend")
    public inputSelfConfiguredBackend(){
        this.ctx.backendType = BackendTypes.selfConfigured;
    }

    @given("azurerm ensure backend is checked with the following")
    public inputAzureRmEnsureBackend(table: DataTable){
        const backend = table.rowsHash();
        this.ctx.ensureBackend = true;
        this.ctx.backendAzureRmResourceGroupLocation = backend.location;
        this.ctx.backendAzureRmStorageAccountSku = backend.sku
    }

    @given("resource target provided with address {string} and id {string}")
    public inputResourceTarget(resourceAddress: string, resourceId: string){
        this.ctx.resourceAddress = resourceAddress;
        this.ctx.resourceId = resourceId;
    }

    @given("force-unlock is run with lock id {string}")
    public forceUnlockIsRunWithLockId(lockId: string){
        this.ctx.lockId = lockId
    }

    @given("the target plan or state file is {string}")
    public targetPlanOrStateFileIs(planOrStateFile: string){
        this.ctx.planOrStateFilePath = planOrStateFile;
    }

    @given("task configured to run az login")
    public taskConfiguredToRunAzLogin(){
        this.ctx.runAzLogin = true;
    }

    @given("publish plan result is {string}")
    public publishPlanResultIsEnabled(name: string){
        this.ctx.publishPlanResults = name;
    }

    @given("workspace command is {string} with name {string}")
    public workspaceCommandIsForName(subCommand: string, name: string){
        this.ctx.subCommand = subCommand;
        this.ctx.workspaceName = name;
    }

    @given("workspace command is {string} with name {string} and command is set to succeed if existing")
    public workspaceCommandIsForNameWithSkipExisting(subCommand: string, name: string){
        this.ctx.subCommand = subCommand;
        this.ctx.workspaceName = name;
        this.ctx.skipExistingWorkspace = true;
    }

    @given("subcommand is {string}")
    public subCommand(subCommand: string){
        this.ctx.subCommand = subCommand;
    }

    @given("state command is {string} with the following addresses:")
    public stateCommandWithAddresses(subCommand: string, addresses: DataTable){
        this.ctx.subCommand = subCommand;
        this.ctx.stateAddresses = addresses.raw().map(r => r[0]);
    }

    @given("state move source is {string}")
    public stateMoveSource(source: string){
        this.ctx.stateMoveSource = source;
    }

    @given("state move destination is {string}")
    public stateMoveDestination(destination: string){
        this.ctx.stateMoveDestination = destination;
    }

    @then("pipeline variable {string} is set to {string}")
    public pipelineVariableIsSet(key: string, value: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.not.be.undefined;
        if(variable){
            expect(variable.val.toString()).to.eq(value);
            expect(variable.secret).to.satisfy((isSecret: boolean | undefined) => {
                return !isSecret;
            });
        }
    }

    @then("pipeline secret {string} is set to {string}")
    public pipelineSecretIsSet(key: string, value: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.not.be.undefined;
        if(variable){
            expect(variable.val).to.eq(value);
            expect(variable.secret).to.satisfy((isSecret: boolean | undefined) => {
                return isSecret === true;
            });
        }
    }

    @then("no pipeline variables starting with {string} are set")
    public noPipelineVariablesStartingWithAreSet(prefix: string){
        const names = Object.keys(this.ctx.variables);
        names.forEach(name => {
            expect(name).to.satisfy((n: string) => !n.startsWith(prefix));
        })
    }

    @then("pipeline variable {string} is not set")
    public pipelineVariableIsNotSet(key: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.be.undefined;
    }

    @then("the resolved terraform version is")
    public theResolvedTerraformVersionIs(table: DataTable){
        const segments = table.rowsHash();
        expect(this.ctx.terraformVersionFull).to.equal(segments["full"]);
        expect(this.ctx.terraformVersionMajor).to.equal(Number.parseInt(segments["major"]));
        expect(this.ctx.terraformVersionMinor).to.equal(Number.parseInt(segments["minor"]));
        expect(this.ctx.terraformVersionPatch).to.equal(Number.parseInt(segments["patch"]));
    }
}