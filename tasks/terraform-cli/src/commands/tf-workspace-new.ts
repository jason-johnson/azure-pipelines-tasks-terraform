import {CommandResponse, CommandStatus, ICommand} from ".";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";

export class TerraformWorkspaceNew implements ICommand {
    constructor(
        private readonly runner: IRunner
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = await new RunWithTerraform(ctx, false, ctx.workspaceSubCommand, [ctx.name])
            .withCommandOptions(ctx.commandOptions)
            .withWorkspace(ctx.workspaceName)
            .build();

        const result = await this.runner.exec(options);


        const command_result = result.toCommandResponse();
        const skipExistingWorkspace = ctx.skipExistingWorkspace && command_result.message && command_result.message.indexOf("already exists") >= 0;
        return new CommandResponse(
            skipExistingWorkspace ? CommandStatus.Success : command_result.status,
            command_result.message,
            skipExistingWorkspace ? 1 : command_result.lastExitCode,
        );
    }
}