import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";

export class AzStorageContainerCreate implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const options = await new RunWithAzCli("create", ["storage", "container"]).build();        
        options.addArgs(
            "--auth-mode", "login",
            "--name", ctx.backendAzureRmContainerName,
            "--account-name", ctx.backendAzureRmStorageAccountName
        );
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}

declare module "." {
    interface CommandPipeline {
        azStorageContainerCreate(this: CommandPipeline): CommandPipeline;
    }
}

CommandPipeline.prototype.azStorageContainerCreate = function(this: CommandPipeline): CommandPipeline {
    return this.pipe((runner: IRunner) => new AzStorageContainerCreate(runner));
}