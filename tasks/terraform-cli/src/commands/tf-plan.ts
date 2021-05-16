import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { ILogger } from "../logger";
import { ITerraformProvider } from "../providers";
import AzureRMProvider from "../providers/azurerm";
import { IRunner, RunnerOptions, RunnerResult } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";


export const publishedPlanAttachmentType = "terraform-plan-results";

const planHasNoChangesRe = /^No changes. Infrastructure is up-to-date./
const planHasChangesRe = /^Terraform will perform the following actions:/
//Plan: 1 to add, 1 to change, 1 to destroy.
//Plan: 0 to add, 1 to change, 1 to destroy.
//Plan: 0 to add, 1 to change, 0 to destroy.
const planSummaryLineRe = /^Plan: ([0-9]?) to add, ([0-9]?) to change, ([0-9]?) to destroy.$/
const planSummaryEndRe = /^[-]+$/

// The lines can have shell color codes in them
const planColorCodesRe = /\x1b\[[0-9;]*m/g

const terraformPlanOkNoChanges = 0
const terraformPlanOk = 0
const terraformPlanFailed = 1
const terraformPlanOkHasChanges = 2

export class TerraformPlan implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner,
        private readonly logger: ILogger
    ) {
    }

    // todo: refactor this so its not repeated in all command handlers
    private getProvider(ctx: ITaskContext): ITerraformProvider | undefined {
        let provider: ITerraformProvider | undefined;
        if (ctx.environmentServiceName) {
            provider = new AzureRMProvider(this.runner);
        }
        return provider;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const provider = this.getProvider(ctx);
        const publishPlanResults = (ctx.publishPlanResults !== undefined ? ctx.publishPlanResults : "").trim()
        const successCodes = this.getPlanSuccessfulExitCodes(ctx.commandOptions, publishPlanResults.length > 0)

        const options = await new RunWithTerraform(ctx)
            .withProvider(ctx, provider)
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withCommandOptions(ctx.commandOptions)
            .withForcedDetailedExitCode(ctx.commandOptions, publishPlanResults.length > 0)
            .withSuccessCodes(successCodes)
            .withRawOutputs()
            .build();
        const result = await this.runner.exec(options);

        ctx.setVariable("TERRAFORM_PLAN_HAS_CHANGES", this.planHasChanges(options, result).toString());

        if (publishPlanResults.length > 0) {
            this.logger.debug("Publish plan results requested. Parsing plan output first...")
            var content = ""
            switch (result.exitCode) {
                case terraformPlanOkNoChanges:
                    content = this.parsePlanOutput(result.stdout, planHasNoChangesRe, ctx.publishPlanResults);
                    this.logger.warning(`Plan '${ctx.publishPlanResults}' has no changes. Infrastructure is up-to-date.`)
                    break;
                case terraformPlanOkHasChanges:
                    content = this.parsePlanOutput(result.stdout, planHasChangesRe, ctx.publishPlanResults)
                    break;
                default:
                    content = result.stdout
            }
            this.taskAgent.attachNewFile(ctx.cwd, publishedPlanAttachmentType, ctx.publishPlanResults, content);
        }

        return result.toCommandResponse();
    }

    private planSummaryReport(toAdd: string, toUpdate: string, toDestroy: string, planName: string) {
        if ( toAdd     != "0" ) this.logger.warning(`Plan '${planName}' is going to create ${toAdd} resources.`)
        if ( toUpdate  != "0" ) this.logger.warning(`Plan '${planName}' is going to update ${toUpdate} resources.`)
        if ( toDestroy != "0" ) this.logger.warning(`Plan '${planName}' is going to destroy ${toDestroy} resources.`)
    }

    private parsePlanOutput(plan: string, summaryLine: RegExp, planName: string): string {
        let planSummary: string[] = [];
        let foundSummary = false
        let lookingForSummaryEnd = false
        let matcher = summaryLine

        for (let line of plan.split('\n')) {
            let tmpLine = line.replace(planColorCodesRe, '');
            let match = tmpLine.match(matcher)

            if (lookingForSummaryEnd && match !== null) {
                break
            }

            if (foundSummary) {
                planSummary.push(line)
                if (match !== null) {
                    this.planSummaryReport(match[1], match[2], match[3], planName)
                    matcher = planSummaryEndRe
                    lookingForSummaryEnd = true
                }
            } else {
                if (match !== null) {
                    foundSummary = true
                    matcher = planSummaryLineRe
                    planSummary.push(line)
                }
            }
        }
        return planSummary.join('\n')
    }

    private getPlanSuccessfulExitCodes(commandOptions: string | undefined, publishPlanResults: boolean): number[] {
        let successCodes: number[] = [];
        successCodes.push(terraformPlanOk);
        if (publishPlanResults || this.hasDetailedExitCode(commandOptions))
            successCodes.push(terraformPlanOkHasChanges);
        return successCodes;
    }

    private hasDetailedExitCode(commandOptions: string | undefined): boolean {
        return commandOptions !== undefined && commandOptions !== null && commandOptions.indexOf('-detailed-exitcode') > -1;
    }

    private planHasChanges(options: RunnerOptions, result: RunnerResult): boolean {
        let val: boolean = false
        if (this.hasDetailedExitCode(options.args.join(" "))) {
            return result.exitCode == terraformPlanOkHasChanges
        } else {
            return result.exitCode == terraformPlanOk
        }
    }
}
