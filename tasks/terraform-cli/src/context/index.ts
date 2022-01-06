import "reflect-metadata";

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
    providerAwsRegion: string;
    backendGcsCredentials: string;
    backendGcsBucket: string;
    backendGcsPrefix: string;
    providerGoogleCredentials?: string;
    providerGoogleProject?: string;
    providerGoogleRegion?: string;
}

export const TRACKED_CONTEXT_PROPERTIES_METADATA_KEY = Symbol("propLogMetadata");

interface TrackedContextProperty{
  alias: string;
  condition?: (target: ITaskContext) => boolean;
  secret?: boolean;
}

export function trackValue(alias: string, condition?: (target: ITaskContext) => boolean, secret?: boolean) {
  return function (target: ITaskContext, propertyKey: string){
    const trackedProps = Reflect.getMetadata(TRACKED_CONTEXT_PROPERTIES_METADATA_KEY, target) || {};
    trackedProps[propertyKey] = <TrackedContextProperty>{ alias, condition, secret };
    Reflect.defineMetadata(TRACKED_CONTEXT_PROPERTIES_METADATA_KEY, trackedProps, target);
  }
}

export function getTrackedProperties(target: ITaskContext): { [key: string]: string } {
  const trackedPropsMetadata = Reflect.getMetadata(TRACKED_CONTEXT_PROPERTIES_METADATA_KEY, target);
  const rvalues: { [key: string]: string } = {};
  for(const key in trackedPropsMetadata){
    const trackedProp = <TrackedContextProperty>trackedPropsMetadata[key];    
    if((!trackedProp.condition || trackedProp.condition(target))){      
      const value = target[key as keyof ITaskContext];
      if(value){
        if(trackedProp.secret){
          rvalues[trackedProp.alias] = "[redacted]";
        }
        else{
          rvalues[trackedProp.alias] = value.toString();
        }      
      }      
    }    
  }
  return rvalues;
}

export { default as AzdoTaskContext } from './azdo-task-context';
export { default as MockTaskContext } from './mock-task-context';