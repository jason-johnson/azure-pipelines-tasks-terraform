import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";

export class AzLogin implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const options = await new RunWithAzCli("login").build();
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