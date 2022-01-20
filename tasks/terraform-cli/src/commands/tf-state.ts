import {CommandResponse, ICommand} from ".";
import {ITaskContext} from "../context";

export class TerraformStateCommand implements ICommand {
    constructor(
        private readonly subCommands: { [subCommand: string]: ICommand }
    ) {
    }

    exec(ctx: ITaskContext): Promise<CommandResponse> {
        console.log(ctx.name);
        const subCommand = this.subCommands[ctx.subCommand];
        if (subCommand) {
            return subCommand.exec(ctx);
        } else {
            throw new Error(`State sub-command "${ctx.subCommand}" is not supported`);
        }
    }
}
