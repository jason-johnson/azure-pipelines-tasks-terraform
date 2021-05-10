import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";

export class AzGroupCreate implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const options = await new RunWithAzCli("create", ["group"]).build();        
        options.addArgs(
            "--name", ctx.backendAzureRmResourceGroupName,
            "--location", ctx.backendAzureRmResourceGroupLocation
        );
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}

declare module "." {
    interface CommandPipeline {
        azGroupCreate(this: CommandPipeline): CommandPipeline;
    }
}

CommandPipeline.prototype.azGroupCreate = function(this: CommandPipeline): CommandPipeline {
    return this.pipe((runner: IRunner) => new AzGroupCreate(runner));
}