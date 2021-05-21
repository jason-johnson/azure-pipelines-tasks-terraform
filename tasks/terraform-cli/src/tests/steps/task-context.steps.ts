import { binding, given, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { MockTaskContext } from '../../context';
import { TableDefinition } from 'cucumber';
import { BackendTypes } from '../../backends';

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

    @given("azurerm backend service connection {string} exists as")
    public inputAzureRmBackendServiceEndpoint(backendServiceName: string, table: TableDefinition){
        var endpoint = table.rowsHash();
        this.ctx.backendServiceArm = backendServiceName;
        this.ctx.backendServiceArmAuthorizationScheme = endpoint.scheme;
        this.ctx.backendServiceArmClientId = endpoint.clientId;
        this.ctx.backendServiceArmClientSecret = endpoint.clientSecret;
        this.ctx.backendServiceArmSubscriptionId = endpoint.subscriptionId;
        this.ctx.backendServiceArmTenantId = endpoint.tenantId;
    }

    @given("azurerm service connection {string} exists as")
    public inputAzureRmServiceEndpoint(environmentServiceName: string, table: TableDefinition){
        var endpoint = table.rowsHash();
        this.ctx.environmentServiceName = environmentServiceName;
        this.ctx.environmentServiceArmAuthorizationScheme = endpoint.scheme;
        this.ctx.environmentServiceArmClientId = endpoint.clientId;
        this.ctx.environmentServiceArmClientSecret = endpoint.clientSecret;
        this.ctx.environmentServiceArmSubscriptionId = endpoint.subscriptionId;
        this.ctx.environmentServiceArmTenantId = endpoint.tenantId;
    }

    @given("azurerm backend type selected with the following storage account")
    public inputAzureRmBackend(table: TableDefinition){
        var backend = table.rowsHash();
        this.ctx.backendType = BackendTypes.azurerm;
        this.ctx.backendAzureRmResourceGroupName = backend.resourceGroup;
        this.ctx.backendAzureRmStorageAccountName = backend.name;
        this.ctx.backendAzureRmContainerName = backend.container;
        this.ctx.backendAzureRmKey = backend.key;
    }

    @given("self-configured backend")
    public inputSelfConfiguredBackend(){
        this.ctx.backendType = BackendTypes.selfConfigured;
    }

    @given("azurerm ensure backend is checked with the following")
    public inputAzureRmEnsureBackend(table: TableDefinition){
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
        this.ctx.workspaceSubCommand = subCommand;
        this.ctx.workspaceName = name;
    }

    @given("the outputType is {string}")
    public outputType(outputType: string){
        this.ctx.outputType = outputType;
    }

    @given("the outputType is {string} and outputName is {string}")
    public outputTypeAndName(outputType: string, outputName: string){
        this.ctx.outputType = outputType;
        this.ctx.outputName = outputName;
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

    @then("pipeline variable {string} is set to {string} as output")
    public pipelineVariableIsSetAsOutput(key: string, value: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.not.be.undefined;
        if(variable){
            expect(variable.val.toString()).to.eq(value);
            expect(variable.secret).to.satisfy((isSecret: boolean | undefined) => {
                return !isSecret;
            });
            expect(variable.isOutput).to.be.true;
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

    @then("pipeline secret {string} is set to {string} as output")
    public pipelineSecretIsSetAsOutput(key: string, value: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.not.be.undefined;
        if(variable){
            expect(variable.val).to.eq(value);
            expect(variable.secret).to.satisfy((isSecret: boolean | undefined) => {
                return isSecret === true;
            });
            expect(variable.isOutput).to.be.true;
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
    public theResolvedTerraformVersionIs(table: TableDefinition){
        const segments = table.rowsHash();
        expect(this.ctx.terraformVersionFull).to.equal(segments["full"]);
        expect(this.ctx.terraformVersionMajor).to.equal(Number.parseInt(segments["major"]));
        expect(this.ctx.terraformVersionMinor).to.equal(Number.parseInt(segments["minor"]));
        expect(this.ctx.terraformVersionPatch).to.equal(Number.parseInt(segments["patch"]));
    }
}
