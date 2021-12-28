import { ITaskContext, trackValue } from ".";
import * as tasks from 'azure-pipelines-task-lib/task';
import { BackendTypes } from "../backends";

const isCommand = (...commands: string[]) => (ctx: ITaskContext) => commands.includes(ctx.name);
const usesProvider = isCommand("plan", "apply", "destroy", "import", "refresh", "forceunlock");
const usesProviderAzureRm = (ctx: ITaskContext) => usesProvider(ctx) && !(!ctx.environmentServiceName)
const usesProviderAws = (ctx: ITaskContext) => usesProvider(ctx) && !(!ctx.providerServiceAws)
const usesBackend = (backendType: BackendTypes) => (ctx: ITaskContext) => isCommand("init") && ctx.backendType == backendType;

export default class AzdoTaskContext implements ITaskContext {
    private getInput: (name: string, required?: boolean | undefined) => string;
    private getBoolInput: (name: string, required?: boolean | undefined) => boolean;
    private getEndpointAuthorizationScheme: (id: string, optional: boolean) => string;
    private getEndpointDataParameter: (id: string, key: string, optional: boolean) => string;
    private getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string;
    private getSecureFileName: (id: string) => string;
    public getVariable: (name: string) => string | undefined;
    public setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
    public startedAt: [number, number];
    public finishedAt: [number, number] | undefined;
    public runTime: number = 0;   

    @trackValue("terraform.version")
    public terraformVersionFull?: string;
    @trackValue("terraform.version.major")
    public terraformVersionMajor?: number;
    @trackValue("terraform.version.minor")
    public terraformVersionMinor?: number;
    @trackValue("terraform.version.patch")
    public terraformVersionPatch?: number;
    constructor() {
        this.getInput = <(name: string, required?: boolean | undefined) => string>tasks.getInput;
        this.getBoolInput = tasks.getBoolInput;
        this.getEndpointAuthorizationScheme = <(id: string, optional: boolean) => string>tasks.getEndpointAuthorizationScheme;
        this.getEndpointDataParameter = <(id: string, key: string, optional: boolean) => string>tasks.getEndpointDataParameter;
        this.getEndpointAuthorizationParameter = <(id: string, key: string, optional: boolean) => string>tasks.getEndpointAuthorizationParameter;
        this.getVariable = tasks.getVariable;
        this.setVariable = tasks.setVariable;
        this.getSecureFileName = <(id: string) => string>tasks.getSecureFileName;
        this.startedAt = process.hrtime();
    }
    get name() {
        return this.getInput("command");
    }
    get cwd() {
        return this.getInput("workingDirectory");
    }
    get commandOptions() {
        return this.getInput("commandOptions");
    }
    @trackValue("inputs.secureFile", () => true, true)
    get secureVarsFileId() {
        return this.getInput("secureVarsFile");
    }
    get secureVarsFileName() {
        return this.getSecureFileName(this.secureVarsFileId);
    }
    @trackValue("inputs.backends.type", isCommand("init"))
    get backendType() {
        return this.getInput("backendType");
    }
    @trackValue("inputs.backends.create", usesBackend(BackendTypes.azurerm))
    get ensureBackend() {
        return this.getBoolInput("ensureBackend");
    }
    @trackValue("inputs.backends.azurerm.service", usesBackend(BackendTypes.azurerm), true)
    get backendServiceArm() {
        return this.getInput("backendServiceArm");
    }
    @trackValue("inputs.backends.azurerm.rg", usesBackend(BackendTypes.azurerm), true)
    get backendAzureRmResourceGroupName() {
        return this.getInput("backendAzureRmResourceGroupName", true);
    }
    @trackValue("inputs.backends.azurerm.rg.location", usesBackend(BackendTypes.azurerm))
    get backendAzureRmResourceGroupLocation() {
        return this.getInput("backendAzureRmResourceGroupLocation", true);
    }
    @trackValue("inputs.backends.azurerm.storage", usesBackend(BackendTypes.azurerm), true)
    get backendAzureRmStorageAccountName() {
        return this.getInput("backendAzureRmStorageAccountName", true);
    }
    @trackValue("inputs.backends.azurerm.storage.sku", usesBackend(BackendTypes.azurerm))
    get backendAzureRmStorageAccountSku() {
        return this.getInput("backendAzureRmStorageAccountSku", true);
    }
    @trackValue("inputs.backends.azurerm.storage.container", usesBackend(BackendTypes.azurerm), true)
    get backendAzureRmContainerName() {
        return this.getInput("backendAzureRmContainerName", true);
    }
    @trackValue("inputs.backends.azurerm.storage.key", usesBackend(BackendTypes.azurerm), true)
    get backendAzureRmKey() {
        return this.getInput("backendAzureRmKey", true);
    }
    get backendServiceArmAuthorizationScheme() {
        return this.getEndpointAuthorizationScheme(this.backendServiceArm, true);
    }
    get backendServiceArmSubscriptionId() {
        return this.getEndpointDataParameter(this.backendServiceArm, "subscriptionid", true);
    }
    get backendServiceArmTenantId() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "tenantid", true);
    }
    get backendServiceArmClientId() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "serviceprincipalid", true);
    }
    get backendServiceArmClientSecret() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "serviceprincipalkey", true);
    }
    @trackValue("inputs.providers.azurerm.service", usesProvider, true)
    get environmentServiceName() {
        return this.getInput("environmentServiceName");
    }
    get environmentServiceArmAuthorizationScheme() {
        return this.getEndpointAuthorizationScheme(this.environmentServiceName, true);
    }
    get environmentServiceArmSubscriptionId() {
        return this.getEndpointDataParameter(this.environmentServiceName, "subscriptionid", true);
    }
    get environmentServiceArmTenantId() {
        return this.getEndpointAuthorizationParameter(this.environmentServiceName, "tenantid", true);
    }
    get environmentServiceArmClientId() {
        return this.getEndpointAuthorizationParameter(this.environmentServiceName, "serviceprincipalid", true);
    }
    get environmentServiceArmClientSecret() {
        return this.getEndpointAuthorizationParameter(this.environmentServiceName, "serviceprincipalkey", true);
    }
    get aiInstrumentationKey() {
        return this.getInput("aiInstrumentationKey");
    }
    get allowTelemetryCollection() {
        return this.getBoolInput("allowTelemetryCollection");
    }
    get resourceAddress() {
        return this.getInput("resourceAddress", true);
    }
    get resourceId() {
        return this.getInput("resourceId", true);
    }
    get lockId() {
        return this.getInput("lockID");
    }    
    get planOrStateFilePath() {
        return this.getInput("inputTargetPlanOrStateFilePath");
    }
    @trackValue("inputs.providers.azurerm.login", usesProviderAzureRm)
    get runAzLogin() {
        return this.getBoolInput("runAzLogin");
    }
    @trackValue("inputs.commands.plan.publish", isCommand("plan"))
    get publishPlanResults() {
        return this.getInput("publishPlanResults");
    }
    @trackValue("inputs.commands.workspace.subCommand", isCommand("workspace"))
    get workspaceSubCommand() {
        return this.getInput("workspaceSubCommand", true);
    }
    get workspaceName() {
        return this.getInput("workspaceName", true);
    }
    @trackValue("inputs.commands.workspace.new.skipExisting", isCommand("workspace"))
    get skipExistingWorkspace() {
        return this.getBoolInput("skipExistingWorkspace", false )
    }
    @trackValue("inputs.backends.aws.service", usesBackend(BackendTypes.aws), true)
    get backendServiceAws() {
      return this.getInput("backendServiceAws");
    }
    get backendServiceAwsAccessKey() {
      return this.getEndpointAuthorizationParameter(this.backendServiceAws, "username", true )
    }
    get backendServiceAwsSecretKey() {
      return this.getEndpointAuthorizationParameter(this.backendServiceAws, "password", true )
    }
    @trackValue("inputs.backends.aws.bucket", usesBackend(BackendTypes.aws), true)
    get backendAwsBucket(){
      return this.getInput("backendAwsBucket", false)
    }
    @trackValue("inputs.backends.aws.key", usesBackend(BackendTypes.aws), true)
    get backendAwsKey(){
      return this.getInput("backendAwsKey", false)
    }
    @trackValue("inputs.backends.aws.region", usesBackend(BackendTypes.aws))
    get backendAwsRegion(){
      return this.getInput("backendAwsRegion", false)
    }
    @trackValue("inputs.providers.aws.service", usesProvider, true)    
    get providerServiceAws() {
      return this.getInput("providerServiceAws");
    }
    get providerServiceAwsAccessKey() {
      return this.getEndpointAuthorizationParameter(this.providerServiceAws, "username", true )
    }    
    get providerServiceAwsSecretKey() {
      return this.getEndpointAuthorizationParameter(this.providerServiceAws, "password", true )
    }    
    @trackValue("inputs.providers.aws.region", usesProviderAws)
    get providerAwsRegion() {
      return this.getInput("providerAwsRegion", true);
    }
    finished() {
        this.finishedAt = process.hrtime(this.startedAt);
        this.runTime = this.finishedAt[1] / 1000000;
    }
    setTerraformVersion(full: string, major: number, minor: number, patch: number){
        this.terraformVersionFull = full;
        this.terraformVersionMajor = major;
        this.terraformVersionMinor = minor;
        this.terraformVersionPatch = patch;
    }
}