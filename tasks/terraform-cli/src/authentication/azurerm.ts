import { ITaskContext } from "../context";

export class AzureRMAuthentication {
  static getServicePrincipalCredentials(ctx: ITaskContext) : ServicePrincipalCredentials {
    const servicePrincipalCredentials : ServicePrincipalCredentials = {
      servicePrincipalId: ctx.environmentServiceArmClientId,
      servicePrincipalKey: ctx.environmentServiceArmClientSecret
    };
    return servicePrincipalCredentials;
  }

  static getWorkloadIdentityFederationCredentials(ctx: ITaskContext) : WorkloadIdentityFederationCredentials {
    var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = {
      servicePrincipalId: ctx.environmentServiceArmClientId,
      idToken: ctx.backendServiceArmSystemAccessToken
    }      
    return workloadIdentityFederationCredentials;
  }
}

export interface ServicePrincipalCredentials {
  servicePrincipalId: string;
  servicePrincipalKey: string;
}

export interface WorkloadIdentityFederationCredentials {
  servicePrincipalId: string;
  idToken: string;
}

export enum AuthorizationScheme {
  ServicePrincipal = "serviceprincipal",
  ManagedServiceIdentity = "managedserviceidentity",
  WorkloadIdentityFederation = "workloadidentityfederation"   
}