import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ILogger } from "../logger";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";

export class TerraformShow implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner, 
        private readonly logger: ILogger
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {        
        const options = await new RunWithTerraform(ctx, true)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)    
            .withJsonOutput(ctx.commandOptions)            
            .withCommandOptions(ctx.commandOptions)
            .withPlanOrStateFile(ctx.planOrStateFilePath)
            .build();
        const result = await this.runner.exec(options);

        //check for destroy
        if (ctx.planOrStateFilePath)
        {
            if(ctx.planOrStateFilePath.includes(".tfstate"))
            {
                this.logger.warning("Cannot check for destroy in .tfstate file");
            }
            else
            {
                this.detectDestroyChanges(ctx, result.stdout);
            }
        }

        return result.toCommandResponse();
    }

    private detectDestroyChanges(ctx: ITaskContext, result: string): void
    {
        let jsonResult : any;
        
        try {                  
            const resultNoEol = result.replace(/(\r\n|\r|\n|\\n|\t|\\")/gm, "");
            jsonResult =JSON.parse(resultNoEol);
        } catch { //SyntaxError: Unexpected token Bug #61
            jsonResult =JSON.parse(result); 
        }
        
        const deleteValue = "delete";

        if(jsonResult.resource_changes){
            for (let resourceChange  of jsonResult.resource_changes) {
                if  (resourceChange.change.actions.includes(deleteValue))
                {
                    this.setDestroyDetectedFlag(ctx, true);
                    this.logger.warning("Destroy detected!")
                    return;
                }
            }
        }
        
        this.logger.debug("No destroy detected")
        this.setDestroyDetectedFlag(ctx, false);
    }

    private setDestroyDetectedFlag(ctx: ITaskContext, value : boolean):void
    {
        ctx.setVariable("TERRAFORM_PLAN_HAS_DESTROY_CHANGES", value.toString(), false);
        this.logger.debug(`set vso[task.setvariable variable=TERRAFORM_PLAN_HAS_DESTROY_CHANGES] to ${value}`)
    }
}
