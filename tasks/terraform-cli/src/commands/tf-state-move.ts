import {CommandResponse, ICommand} from ".";
import { ITaskContext } from "../context";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";

export class TerraformStateMoveCommand implements ICommand {
    constructor(
        private readonly runner: IRunner,
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = await new RunWithTerraform(ctx, false, ctx.stateSubCommand, [ctx.name])
            .withCommandOptions(ctx.commandOptions)
            .withSourceDestination(ctx.stateMoveSource, ctx.stateMoveDestination)
            .build();

        const result = await this.runner.exec(options);

        return result.toCommandResponse();
    }
}