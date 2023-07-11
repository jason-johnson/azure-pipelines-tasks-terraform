import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";
import { AzureRMAuthentication, AuthorizationScheme } from "../authentication/azurerm";

export class AzLogin implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const options = await new RunWithAzCli("login").build();

        const authorizationScheme = AzureRMAuthentication.getAuthorizationScheme(ctx.backendServiceArm ? ctx.backendServiceArmAuthorizationScheme : ctx.environmentServiceArmAuthorizationScheme);
 
        switch(authorizationScheme) {
            case AuthorizationScheme.ServicePrincipal:
                if(ctx.backendServiceArm){
                    options.addArgs(
                        "--service-principal", 
                        "-t", ctx.backendServiceArmTenantId,
                        "-u", ctx.backendServiceArmClientId,
                        "-p", ctx.backendServiceArmClientSecret
                    );
                }
                else{
                    options.addArgs(
                        "--service-principal", 
                        "-t", ctx.environmentServiceArmTenantId,
                        "-u", ctx.environmentServiceArmClientId,
                        "-p", ctx.environmentServiceArmClientSecret
                    );
                }
                break;
    
            case AuthorizationScheme.ManagedServiceIdentity:
                options.addArgs(
                    "--identity" 
                );
                break;
    
            case AuthorizationScheme.WorkloadIdentityFederation:
                if(ctx.backendServiceArm){
                    options.addArgs(
                        "--service-principal", 
                        "-t", ctx.backendServiceArmTenantId,
                        "-u", ctx.backendServiceArmClientId,
                        "--allow-no-subscriptions",
                        "--federated-token", ctx.backendServiceArmIdToken
                    );
                }
                else{
                    options.addArgs(
                        "--service-principal", 
                        "-t", ctx.environmentServiceArmTenantId,
                        "-u", ctx.environmentServiceArmClientId,
                        "--allow-no-subscriptions",
                        "--federated-token", ctx.environmentServiceArmIdToken
                    );
                }
                break;
        }
        
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}

declare module "." {
    interface CommandPipeline {
        azLogin(this: CommandPipeline): CommandPipeline;
    }
}

CommandPipeline.prototype.azLogin = function(this: CommandPipeline): CommandPipeline {
    return this.pipe((runner: IRunner) => new AzLogin(runner));
}