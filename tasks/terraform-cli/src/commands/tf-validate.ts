import { ICommand, CommandResponse } from ".";
import { IRunner } from "../runners";
import { ITaskAgent } from "../task-agent";
import { RunnerOptionsBuilder, RunWithTerraform } from "../runners/builders";
import { ITaskContext } from "../context";

export class TerraformValidate implements ICommand {
    private readonly taskAgent: ITaskAgent;
    private readonly runner: IRunner;    

    constructor(taskAgent: ITaskAgent, runner: IRunner){
        this.runner = runner;
        this.taskAgent = taskAgent;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        let builder: RunnerOptionsBuilder = new RunWithTerraform(ctx);

        if(!ctx.terraformVersionMinor || ctx.terraformVersionMinor < 15){
            builder = builder.withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
        }
        builder = builder.withCommandOptions(ctx.commandOptions);
        const options = await builder.build();
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}
