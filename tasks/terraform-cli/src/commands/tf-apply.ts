import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { TerraformProviderContext } from "../providers";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";

export class TerraformApply implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner,
        private readonly providers: TerraformProviderContext
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        await this.providers.init();      
        const options = await new RunWithTerraform(ctx)            
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)    
            .withAutoApprove()
            .withCommandOptions(ctx.commandOptions)
            .build();
        
        const result = await this.runner.exec(options);

        return result.toCommandResponse();
    }
}