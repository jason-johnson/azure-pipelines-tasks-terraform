import { ITerraformProvider } from ".";
import { CommandPipeline } from "../commands";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";

export default class AzureRMProvider implements ITerraformProvider {
    constructor(
        private readonly runner: IRunner,
        private readonly ctx: ITaskContext){
    }

    isDefined(): boolean{
      if(this.ctx.environmentServiceName){
        return true;
      }
      else{
        return false;
      }
    }

    async init(): Promise<void> {
      var authorizationScheme : AuthorizationScheme = AuthorizationScheme.ServicePrincipal;

      try {
          authorizationScheme = AuthorizationScheme[this.ctx.environmentServiceArmAuthorizationScheme.toLowerCase() as keyof typeof AuthorizationScheme];
      }
      catch(error){
          throw "Terraform only supports service principal, managed service identity or workload identity federation authorization";
      }

      switch(authorizationScheme) {
        case AuthorizationScheme.ServicePrincipal:
            var servicePrincipalCredentials : ServicePrincipalCredentials = this.getServicePrincipalCredentials();
            process.env['ARM_CLIENT_ID']        = servicePrincipalCredentials.servicePrincipalId;
            process.env['ARM_CLIENT_SECRET']    = servicePrincipalCredentials.servicePrincipalKey;
            break;

        case AuthorizationScheme.ManagedServiceIdentity:
            process.env['ARM_USE_MSI'] = 'true';
            break;

        case AuthorizationScheme.WorkloadIdentityFederation:
            var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = this.getWorkloadIdentityFederationCredentials();
            process.env['ARM_CLIENT_ID'] = workloadIdentityFederationCredentials.servicePrincipalId;
            process.env['ARM_OIDC_TOKEN'] = workloadIdentityFederationCredentials.idToken;
            process.env['ARM_USE_OIDC'] = 'true';
            break;
      }
  
      const subscriptionId = this.ctx.providerAzureRmSubscriptionId || this.ctx.environmentServiceArmSubscriptionId;

      if(subscriptionId){
        process.env['ARM_SUBSCRIPTION_ID']  = subscriptionId;
      }      

      process.env['ARM_TENANT_ID']        = this.ctx.environmentServiceArmTenantId;

      if(this.ctx.runAzLogin){
          //run az login so provisioners needing az cli can be run.
          await new CommandPipeline(this.runner)
              .azLogin()
              .exec(this.ctx);
      }        
    }

    private getServicePrincipalCredentials() : ServicePrincipalCredentials {
      const servicePrincipalCredentials : ServicePrincipalCredentials = {
        servicePrincipalId: this.ctx.environmentServiceArmClientId,
        servicePrincipalKey: this.ctx.environmentServiceArmClientSecret
      };
      return servicePrincipalCredentials;
    }

    private getWorkloadIdentityFederationCredentials() : WorkloadIdentityFederationCredentials {
       var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = {
        servicePrincipalId: this.ctx.environmentServiceArmClientId,
        idToken: this.ctx.backendServiceArmSystemAccessToken
      }      
      return workloadIdentityFederationCredentials;
    }
}

interface ServicePrincipalCredentials {
    servicePrincipalId: string;
    servicePrincipalKey: string;
}

interface WorkloadIdentityFederationCredentials {
    servicePrincipalId: string;
    idToken: string;
}

enum AuthorizationScheme {
    ServicePrincipal = "serviceprincipal",
    ManagedServiceIdentity = "managedserviceidentity",
    WorkloadIdentityFederation = "workloadidentityfederation"   
}