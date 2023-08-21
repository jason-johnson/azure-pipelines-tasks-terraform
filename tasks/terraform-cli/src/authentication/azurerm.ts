import { ITaskContext } from "../context";

export class AzureRMAuthentication {
  static getServicePrincipalCredentials(ctx: ITaskContext, isBackend: boolean = false) : ServicePrincipalCredentials {
    let servicePrincipalCredentials : ServicePrincipalCredentials = {
      servicePrincipalId: ctx.environmentServiceArmClientId,
      servicePrincipalKey: ctx.environmentServiceArmClientSecret
    };

    if(isBackend){
      servicePrincipalCredentials = {
        servicePrincipalId: ctx.backendServiceArmClientId,
        servicePrincipalKey: ctx.backendServiceArmClientSecret
      };
    }

    return servicePrincipalCredentials;
  }

  static getWorkloadIdentityFederationCredentials(ctx: ITaskContext, isBackend: boolean = false) : WorkloadIdentityFederationCredentials {
    var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = {
      servicePrincipalId: ctx.environmentServiceArmClientId,
      idToken: ctx.environmentServiceArmIdToken
    }      

    if(isBackend){
      workloadIdentityFederationCredentials = {
        servicePrincipalId: ctx.backendServiceArmClientId,
        idToken: ctx.backendServiceArmIdToken
      }
    }
    return workloadIdentityFederationCredentials;
  }

  static getAuthorizationScheme(sourceAuthorizationScheme: string) : AuthorizationScheme {
    let authorizationScheme : AuthorizationScheme = AuthorizationScheme.ServicePrincipal;

    authorizationScheme = AuthorizationScheme[sourceAuthorizationScheme as keyof typeof AuthorizationScheme];
    if(!authorizationScheme){
      throw "Terraform only supports service principal, managed service identity or workload identity federation authorization";
    }

    return authorizationScheme;
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