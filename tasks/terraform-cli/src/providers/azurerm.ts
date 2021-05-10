import { ITerraformProvider } from ".";
import { CommandPipeline } from "../commands";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";

interface AzureRMProviderConfiguration{
    scheme: string;
    subscriptionId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
}

export default class AzureRMProvider implements ITerraformProvider {
    constructor(
        private readonly runner: IRunner){
    }

    async init(ctx: ITaskContext): Promise<void> {
        const config: AzureRMProviderConfiguration = {
            subscriptionId: ctx.environmentServiceArmSubscriptionId,
            tenantId: ctx.environmentServiceArmTenantId,
            clientId: ctx.environmentServiceArmClientId,
            clientSecret: ctx.environmentServiceArmClientSecret,
            scheme: ctx.environmentServiceArmAuthorizationScheme
        };
        if(config.scheme != "ServicePrincipal"){
            throw "Terraform only supports service principal authorization for azure";
        }

        process.env['ARM_SUBSCRIPTION_ID']  = config.subscriptionId;
        process.env['ARM_TENANT_ID']        = config.tenantId;
        process.env['ARM_CLIENT_ID']        = config.clientId;
        process.env['ARM_CLIENT_SECRET']    = config.clientSecret;

        if(ctx.runAzLogin){
            //run az login so provisioners needing az cli can be run.
            await new CommandPipeline(this.runner)
                .azLogin()
                .exec(ctx);
        }
        
    }
}