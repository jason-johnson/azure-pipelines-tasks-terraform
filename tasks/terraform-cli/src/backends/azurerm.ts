import { ITerraformBackend, TerraformBackendInitResult } from ".";
import { CommandPipeline } from "../commands";
import { IRunner } from "../runners";
import { ITaskContext } from "../context";
import { AzureRMAuthentication, AuthorizationScheme, ServicePrincipalCredentials, WorkloadIdentityFederationCredentials } from "../authentication/azurerm";

export default class AzureRMBackend implements ITerraformBackend {
    constructor(
        private readonly runner: IRunner
    ) { }

    async init(ctx: ITaskContext): Promise<TerraformBackendInitResult> {
        const authorizationScheme = AzureRMAuthentication.getAuthorizationScheme(ctx.backendServiceArmAuthorizationScheme);

        let backendConfig: any = {
            storage_account_name: ctx.backendAzureRmStorageAccountName,
            container_name: ctx.backendAzureRmContainerName,
            key: ctx.backendAzureRmKey,
            resource_group_name: ctx.backendAzureRmResourceGroupName
        }

        const isPre12 = ctx.terraformVersionMajor === 0 && typeof(ctx.terraformVersionMinor) == 'number' && ctx.terraformVersionMinor < 12;

        const subscriptionId = ctx.backendAzureRmSubscriptionId || ctx.backendServiceArmSubscriptionId;
        
        const tenantId = ctx.backendAzureRmTenantId

        //use the arm_* prefix config only for versions before 0.12.0
        if(isPre12){
            if(subscriptionId){
              backendConfig.arm_subscription_id = subscriptionId
            }
            if(tenantId){
              backendConfig.arm_tenant_id = tenantId
            } 
            else {
              backendConfig.arm_tenant_id = ctx.backendServiceArmTenantId;
            }
        }
        else{
            if(subscriptionId){
              backendConfig.subscription_id = subscriptionId
            }
            if(tenantId){
              backendConfig.tenant_id = tenantId;
            } 
            else {
              backendConfig.tenant_id = ctx.backendServiceArmTenantId;
            }
        }

        switch(authorizationScheme) {
          case AuthorizationScheme.ServicePrincipal:
              var servicePrincipalCredentials : ServicePrincipalCredentials = AzureRMAuthentication.getServicePrincipalCredentials(ctx, true);
              if(isPre12){
                backendConfig.arm_client_id        = servicePrincipalCredentials.servicePrincipalId;
                backendConfig.arm_client_secret    = servicePrincipalCredentials.servicePrincipalKey;
              }
              else {
                backendConfig.client_id        = servicePrincipalCredentials.servicePrincipalId;
                backendConfig.client_secret    = servicePrincipalCredentials.servicePrincipalKey;
              }
              break;
  
          case AuthorizationScheme.ManagedServiceIdentity:
              if(isPre12){
                throw new Error('Managed Service Identity is not supported for Terraform versions before 0.12.0');
              }
              backendConfig.use_msi = 'true';
              break;
  
          case AuthorizationScheme.WorkloadIdentityFederation:
              if(isPre12){
                throw new Error('Workload Identity Federation is not supported for Terraform versions before 0.12.0');
              }
              var workloadIdentityFederationCredentials : WorkloadIdentityFederationCredentials = AzureRMAuthentication.getWorkloadIdentityFederationCredentials(ctx, true);
              backendConfig.client_id = workloadIdentityFederationCredentials.servicePrincipalId;
              backendConfig.oidc_token = workloadIdentityFederationCredentials.idToken;
              backendConfig.use_oidc = 'true';
              break;
        }
        
        const result = <TerraformBackendInitResult>{
            args: []
        };

        for (var config in backendConfig) {
            if(backendConfig[config]){
              result.args.push(`-backend-config=${config}=${backendConfig[config]}`);
            }            
        }

        if (ctx.ensureBackend === true) {
            await this.ensureBackend(ctx);
        }

        return result;
    }

    private async ensureBackend(ctx: ITaskContext) {
      await new CommandPipeline(this.runner)
        .azLogin()
        .azAccountSet()
        .azGroupCreate()
        .azStorageAccountCreate()
        .azStorageContainerCreate()
        .exec(ctx);
    }
}