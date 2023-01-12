import {CommandResponse, ICommand} from ".";
import {ITaskContext} from "../context";

export class TerraformStateCommand implements ICommand {
    constructor(
        private readonly subCommands: { [subCommand: string]: ICommand }
    ) {
    }

    exec(ctx: ITaskContext): Promise<CommandResponse> {
        const subCommand = this.subCommands[ctx.stateSubCommand];
        if (subCommand) {
            return subCommand.exec(ctx);
        } else {
            throw new Error(`State sub-command "${ctx.stateSubCommand}" is not supported`);
        }
    }
}
