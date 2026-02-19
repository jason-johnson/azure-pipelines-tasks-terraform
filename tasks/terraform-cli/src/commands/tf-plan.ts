import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ILogger } from "../logger";
import { TerraformProviderContext } from "../providers";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { formatPlanSummary, parsePlanJson } from "./plan-parser";

export const publishedPlanAttachmentType = "terraform-plan-results";

const terraformPlanOkNoChanges = 0
const terraformPlanOk = 0
const terraformPlanFailed = 1
const terraformPlanOkHasChanges = 2

export class TerraformPlan implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner,
        private readonly logger: ILogger,
        private readonly providers: TerraformProviderContext
    ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        await this.providers.init();
        
        // Always generate a plan file for accurate change detection
        const publishPlanResults = (ctx.publishPlanResults !== undefined ? ctx.publishPlanResults : "").trim();
        
        // Use a predictable name in test mode, otherwise use UUID
        const isTestMode = process.env.TASK_TEST_MODE === 'true';
        const generatedPlanName = isTestMode ? 'tfplan-test.tfplan' : `tfplan-${uuidv4()}.tfplan`;
        const planName = publishPlanResults.length > 0 ? publishPlanResults : generatedPlanName;
        const planFilePath = path.join(ctx.cwd, planName);
        
        // Always add -detailed-exitcode and plan file
        const successCodes = [terraformPlanOk, terraformPlanOkHasChanges];

        // Run terraform plan with -out to generate plan file
        const planOptions = await new RunWithTerraform(ctx)            
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withCommandOptions(ctx.commandOptions)
            .withPlanFile(planFilePath)
            .withForcedDetailedExitCode(ctx.commandOptions, true)
            .withSuccessCodes(successCodes)
            .withRawOutputs()
            .build();
        const planResult = await this.runner.exec(planOptions);

        // Run terraform show -json on the plan file to get structured data
        const showOptions = await new RunWithTerraform(ctx, true, "show")
            .withJsonOutput(undefined)
            .withPlanOrStateFile(planFilePath)
            .build();
        const showResult = await this.runner.exec(showOptions);

        // Parse the JSON output to detect changes
        const planSummary = parsePlanJson(showResult.stdout);
        
        // Set the TERRAFORM_PLAN_HAS_CHANGES variable based on JSON analysis
        ctx.setVariable("TERRAFORM_PLAN_HAS_CHANGES", planSummary.hasChanges.toString());
        
        // Set TERRAFORM_PLAN_HAS_DESTROY_CHANGES variable for consistency with show command
        ctx.setVariable("TERRAFORM_PLAN_HAS_DESTROY_CHANGES", (planSummary.destroy > 0).toString());

        // Log plan summary
        const displayName = publishPlanResults.length > 0 ? publishPlanResults : "plan";
        const summaryMessages = formatPlanSummary(planSummary, displayName);
        for (const message of summaryMessages) {
            if (planSummary.hasChanges) {
                this.logger.warning(message);
            } else {
                console.log(message);
            }
        }

        // Publish plan results if explicitly requested
        if (publishPlanResults.length > 0) {
            this.logger.debug("Publishing plan results...");
            this.taskAgent.attachNewPlanFile(ctx.cwd, publishedPlanAttachmentType, publishPlanResults, planResult.stdout);
        }

        return planResult.toCommandResponse();
    }


}
