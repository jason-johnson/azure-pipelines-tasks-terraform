import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";

export class AzAccountSet implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const options = await new RunWithAzCli("set", ["account"]).build();
        options.addArgs(
            "-s", (ctx.backendAzureRmSubscriptionId || ctx.backendServiceArmSubscriptionId)
        );
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}

declare module "." {
    interface CommandPipeline {
        azAccountSet(this: CommandPipeline): CommandPipeline;
    }
}

CommandPipeline.prototype.azAccountSet = function(this: CommandPipeline): CommandPipeline {
    return this.pipe((runner: IRunner) => new AzAccountSet(runner));
}