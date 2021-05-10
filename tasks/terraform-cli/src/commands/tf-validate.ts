import { ICommand, CommandResponse } from ".";
import { IRunner } from "../runners";
import { ITaskAgent } from "../task-agent";
import { RunWithTerraform } from "../runners/builders";
import { ITaskContext } from "../context";

export class TerraformValidate implements ICommand {
    private readonly taskAgent: ITaskAgent;
    private readonly runner: IRunner;    

    constructor(taskAgent: ITaskAgent, runner: IRunner){
        this.runner = runner;
        this.taskAgent = taskAgent;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = await new RunWithTerraform(ctx)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withCommandOptions(ctx.commandOptions)
            .build();
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}
