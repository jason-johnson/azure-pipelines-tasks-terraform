export interface ITaskContext {
    name: string;
    cwd: string;
    commandOptions?: string;
    secureVarsFileId: string;
    secureVarsFileName: string;
    backendType?: string;
    ensureBackend?: boolean;
    backendServiceArm: string;
    backendAzureRmResourceGroupName: string;
    backendAzureRmResourceGroupLocation: string;
    backendAzureRmStorageAccountName: string;
    backendAzureRmStorageAccountSku: string;
    backendAzureRmContainerName: string;
    backendAzureRmKey: string;
    backendServiceArmAuthorizationScheme: string;
    backendServiceArmSubscriptionId: string;
    backendServiceArmTenantId: string;
    backendServiceArmClientId: string;
    backendServiceArmClientSecret: string;
    environmentServiceName?: string;
    environmentServiceArmAuthorizationScheme: string;
    environmentServiceArmClientId: string;
    environmentServiceArmClientSecret: string;
    environmentServiceArmSubscriptionId: string;
    environmentServiceArmTenantId: string;
    aiInstrumentationKey?: string;
    allowTelemetryCollection: boolean;
    resourceAddress: string;
    resourceId: string;
    lockId: string;
    planOrStateFilePath: string;
    runAzLogin?: boolean;
    publishPlanResults: string;
    workspaceSubCommand: string;
    workspaceName: string;
    setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
    runTime: number;
    finished: () => void;
    terraformVersionFull?: string;
    terraformVersionMajor?: number;
    terraformVersionMinor?: number;
    terraformVersionPatch?: number;
    setTerraformVersion: (full: string, major: number, minor: number, patch: number) => void;
    skipExistingWorkspace?: boolean;
    backendServiceAws: string;
    backendServiceAwsAccessKey: string;
    backendServiceAwsSecretKey: string;
    backendAwsBucket?: string;
    backendAwsKey?: string;
    backendAwsRegion?: string;
    providerServiceAws?: string;
    providerServiceAwsAccessKey: string;
    providerServiceAwsSecretKey: string;
    providerAwsRegion?: string;
}

export { default as AzdoTaskContext } from './azdo-task-context';
export { default as MockTaskContext } from './mock-task-context';