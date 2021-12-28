import { ICommand, CommandResponse } from ".";
import { IRunner } from "../runners";
import { AzureRMBackend, BackendTypes, ITerraformBackend } from "../backends";
import { RunWithTerraform } from "../runners/builders";
import { ITaskContext } from "../context";
import { ITaskAgent } from "../task-agent";
import AwsBackend from "../backends/aws";
import { ILogger } from "../logger";

export class TerraformInit implements ICommand {
    private readonly runner: IRunner;    
    private readonly taskAgent: ITaskAgent;
    private readonly logger: ILogger;

    constructor(taskAgent: ITaskAgent, runner: IRunner, logger: ILogger){
        this.taskAgent = taskAgent;
        this.runner = runner;
        this.logger = logger;
    }

    private getBackend(ctx: ITaskContext): ITerraformBackend | undefined{        
        let backend: ITerraformBackend | undefined;
        this.logger.properties["terraform.backend.type"] = <string>ctx.backendType;
        switch(ctx.backendType){
            case BackendTypes.azurerm:
              backend = new AzureRMBackend(this.runner);
              break;
            case BackendTypes.aws:
              backend = new AwsBackend();
              break;
        }
        return backend
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const backend = this.getBackend(ctx);
        const options = await new RunWithTerraform(ctx)
            .withBackend(ctx, backend)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withCommandOptions(ctx.commandOptions)
            .build();

        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}
