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

  static getAuthorizationScheme(authorizationScheme: string) : AuthorizationScheme {
    if(authorizationScheme == undefined) {
      throw('The authorization scheme is missing. Terraform only supports service principal, managed service identity or workload identity federation authorization');
    }

    if(authorizationScheme.toLowerCase() == AuthorizationScheme.ServicePrincipal){
        return AuthorizationScheme.ServicePrincipal;
    }

    if(authorizationScheme.toLowerCase() == AuthorizationScheme.ManagedServiceIdentity){
        return AuthorizationScheme.ManagedServiceIdentity;
    }

    if(authorizationScheme.toLowerCase() == AuthorizationScheme.WorkloadIdentityFederation){
        return AuthorizationScheme.WorkloadIdentityFederation;
    }

    throw('No matching authorization scheme was found. Terraform only supports service principal, managed service identity or workload identity federation authorization');
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