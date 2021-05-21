import { ITaskContext } from ".";
import * as tasks from 'azure-pipelines-task-lib/task';

export default class AzdoTaskContext implements ITaskContext {
    private getInput: (name: string, required?: boolean | undefined) => string;
    private getBoolInput: (name: string, required?: boolean | undefined) => boolean;
    private getEndpointAuthorizationScheme: (id: string, optional: boolean) => string;
    private getEndpointDataParameter: (id: string, key: string, optional: boolean) => string;
    private getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string;
    private getSecureFileName: (id: string) => string;
    public getVariable: (name: string) => string | undefined;
    public setVariable: (name: string, val: string, secret?: boolean | undefined, isOutput?: boolean | undefined) => void;
    public startedAt: [number, number];
    public finishedAt: [number, number] | undefined;
    public runTime: number = 0;
    public terraformVersionFull?: string;
    public terraformVersionMajor?: number;
    public terraformVersionMinor?: number;
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
    get secureVarsFileId() {
        return this.getInput("secureVarsFile");
    }
    get secureVarsFileName() {
        return this.getSecureFileName(this.secureVarsFileId);
    }
    get backendType() {
        return this.getInput("backendType");
    }
    get ensureBackend() {
        return this.getBoolInput("ensureBackend");
    }
    get backendServiceArm() {
        return this.getInput("backendServiceArm");
    }
    get backendAzureRmResourceGroupName() {
        return this.getInput("backendAzureRmResourceGroupName", true);
    }
    get backendAzureRmResourceGroupLocation() {
        return this.getInput("backendAzureRmResourceGroupLocation", true);
    }
    get backendAzureRmStorageAccountName() {
        return this.getInput("backendAzureRmStorageAccountName", true);
    }
    get backendAzureRmStorageAccountSku() {
        return this.getInput("backendAzureRmStorageAccountSku", true);
    }
    get backendAzureRmContainerName() {
        return this.getInput("backendAzureRmContainerName", true);
    }
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
    get runAzLogin() {
        return this.getBoolInput("runAzLogin");
    }
    get publishPlanResults() {
        return this.getInput("publishPlanResults");
    }
    get workspaceSubCommand() {
        return this.getInput("workspaceSubCommand", true);
    }
    get workspaceName() {
        return this.getInput("workspaceName", true);
    }
    get outputName() {
        return this.getInput("outputName");
    }
    get outputType() {
        return this.getInput("outputType");
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
