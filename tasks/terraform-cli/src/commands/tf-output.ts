import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ILogger } from "../logger";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";

export class TerraformOutput implements ICommand {
    constructor(
        private readonly runner: IRunner,
        private readonly logger: ILogger
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = await new RunWithTerraform(ctx, true)
            .withJsonOutput(ctx.commandOptions)
            .withCommandOptions(ctx.commandOptions)
            .withOutputArguments(ctx.outputName)
            .build();
        const result = await this.runner.exec(options);

        if(result.stdout){
            const outputVariables = JSON.parse(result.stdout);

            for(const key in outputVariables){
                const outputVariable = outputVariables[key];
                if(["string", "number", "bool"].includes(outputVariable.type)){
                    // set pipeline variable so its available to subsequent steps
                    if (ctx.outputType = "raw") {
                        ctx.setVariable(`TF_OUT_${key.toUpperCase()}`, outputVariable.value, outputVariable.sensitive, true);
                    }
                    else if (ctx.outputType = "json") {
                        ctx.setVariable(`TF_OUT_${key.toUpperCase()}`, JSON.stringify(outputVariable), outputVariable.sensitive, true);
                    }
                    if ( outputVariable.sensitive ) {
                        console.log(`TF_OUT_${key.toUpperCase()}`, "=", "********* (sensitive)");
                    }
                    else {
                        console.log(`TF_OUT_${key.toUpperCase()}`, "=", outputVariable.value);
                    }
                }
                else {
                    this.logger.warning(`Currently only keys of type \"string\", \"number\", and \"bool\" will returned. The key \"${key}\" is not supported!`)
                }
            }
        }
        else{
            this.logger.warning("Terraform output command was run but, returned no results. No output variables found.")
        }

        return result.toCommandResponse();
    }
}
