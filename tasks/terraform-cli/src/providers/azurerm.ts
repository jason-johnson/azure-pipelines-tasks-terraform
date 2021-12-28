import { ITerraformProvider } from ".";
import { CommandPipeline } from "../commands";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";

export default class AzureRMProvider implements ITerraformProvider {
    constructor(
        private readonly runner: IRunner,
        private readonly ctx: ITaskContext){
    }

    get name() {
      return "azurerm";
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
      if(this.ctx.environmentServiceArmAuthorizationScheme != "ServicePrincipal"){
          throw "Terraform only supports service principal authorization for azure";
      }

      process.env['ARM_SUBSCRIPTION_ID']  = this.ctx.environmentServiceArmSubscriptionId;
      process.env['ARM_TENANT_ID']        = this.ctx.environmentServiceArmTenantId;
      process.env['ARM_CLIENT_ID']        = this.ctx.environmentServiceArmClientId;
      process.env['ARM_CLIENT_SECRET']    = this.ctx.environmentServiceArmClientSecret;

      if(this.ctx.runAzLogin){
          //run az login so provisioners needing az cli can be run.
          await new CommandPipeline(this.runner)
              .azLogin()
              .exec(this.ctx);
      }        
    }
}