import { ITerraformBackend, TerraformBackendInitResult } from ".";
import { CommandPipeline } from "../commands";
import { IRunner } from "../runners";
import { ITaskContext } from "../context";

export default class AzureRMBackend implements ITerraformBackend {
    constructor(
        private readonly runner: IRunner
    ) { }

    async init(ctx: ITaskContext): Promise<TerraformBackendInitResult> {
        if (ctx.backendServiceArmAuthorizationScheme != "ServicePrincipal") {
            throw "Terraform backend initialization for AzureRM only support service principal authorization";
        }
        if(!ctx.backendServiceArmSubscriptionId && !ctx.backendAzureRmSubscriptionId){
          throw "Unable to resolve subscription id. Subscription Id must be defined either on Backend Service Connection with Subscription Id scope or, explicitly set in the `backendAzureRmSubscriptionId` input when using other scopes such as Management Group."
        }

        let backendConfig: any = {
            storage_account_name: ctx.backendAzureRmStorageAccountName,
            container_name: ctx.backendAzureRmContainerName,
            key: ctx.backendAzureRmKey,
            resource_group_name: ctx.backendAzureRmResourceGroupName
        }

        //use the arm_* prefix config only for versions before 0.12.0
        if(ctx.terraformVersionMajor === 0 && typeof(ctx.terraformVersionMinor) == 'number' && ctx.terraformVersionMinor < 12){
            backendConfig.arm_subscription_id = ctx.backendAzureRmSubscriptionId || ctx.backendServiceArmSubscriptionId;
            backendConfig.arm_tenant_id = ctx.backendServiceArmTenantId;
            backendConfig.arm_client_id = ctx.backendServiceArmClientId;
            backendConfig.arm_client_secret = ctx.backendServiceArmClientSecret;
        }
        else{
            backendConfig.subscription_id = ctx.backendAzureRmSubscriptionId || ctx.backendServiceArmSubscriptionId;
            backendConfig.tenant_id = ctx.backendServiceArmTenantId;
            backendConfig.client_id = ctx.backendServiceArmClientId;
            backendConfig.client_secret = ctx.backendServiceArmClientSecret;
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
