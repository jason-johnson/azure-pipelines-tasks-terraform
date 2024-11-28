import { ITerraformProvider } from ".";
import { CommandPipeline } from "../commands";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";
import { AzureRMAuthentication, AuthorizationScheme, ServicePrincipalCredentials, WorkloadIdentityFederationCredentials } from "../authentication/azurerm";

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
      process.env['TF_IN_AUTOMATION']        = 'True';

      const authorizationScheme = AzureRMAuthentication.getAuthorizationScheme(this.ctx.environmentServiceArmAuthorizationScheme);
 
      const subscriptionId = this.ctx.providerAzureRmSubscriptionId || this.ctx.environmentServiceArmSubscriptionId;

      if(subscriptionId){
        process.env['ARM_SUBSCRIPTION_ID']  = subscriptionId;
      }      

      process.env['ARM_TENANT_ID']        = this.ctx.environmentServiceArmTenantId;

      switch(authorizationScheme) {
        case AuthorizationScheme.ServicePrincipal:
            var servicePrincipalCredentials : ServicePrincipalCredentials = AzureRMAuthentication.getServicePrincipalCredentials(this.ctx);
            process.env['ARM_CLIENT_ID']        = servicePrincipalCredentials.servicePrincipalId;
            process.env['ARM_CLIENT_SECRET']    = servicePrincipalCredentials.servicePrincipalKey;
            break;

        case AuthorizationScheme.ManagedServiceIdentity:
            process.env['ARM_USE_MSI'] = 'true';
            break;

        case AuthorizationScheme.WorkloadIdentityFederation:
            var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = AzureRMAuthentication.getWorkloadIdentityFederationCredentials(this.ctx);
            process.env['ARM_CLIENT_ID'] = workloadIdentityFederationCredentials.servicePrincipalId;
            process.env['ARM_OIDC_TOKEN'] = workloadIdentityFederationCredentials.idToken;
            process.env['ARM_USE_OIDC'] = 'true';
            break;
      }
  
      if(this.ctx.runAzLogin){
          //run az login so provisioners needing az cli can be run.
          await new CommandPipeline(this.runner)
              .azLogin()
              .exec(this.ctx);
      }        
    }
}