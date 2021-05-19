import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ITerraformProvider } from "../providers";
import AzureRMProvider from "../providers/azurerm";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";

export class TerraformDestroy implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner
        ) {
    }

    // todo: refactor this so its not repeated in all command handlers
    private getProvider(ctx: ITaskContext): ITerraformProvider | undefined {
        let provider: ITerraformProvider | undefined;
        if(ctx.environmentServiceName){
            provider = new AzureRMProvider(this.runner);
        }
        return provider;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const provider = this.getProvider(ctx);
        const options = await new RunWithTerraform(ctx)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)    
            .withAutoApprove()
            .withProvider(ctx, provider)
            .withCommandOptions(ctx.commandOptions)
            .build();
        const result = await this.runner.exec(options);

        return result.toCommandResponse();
    }
}
