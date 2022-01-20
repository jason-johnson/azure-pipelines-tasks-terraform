import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";

export class TerraformWorkspace implements ICommand{
  constructor(
    private readonly subCommands: {[subCommand: string]: ICommand}
    ) {    
  }

  exec(ctx: ITaskContext): Promise<CommandResponse>{
    const subCommand = this.subCommands[ctx.subCommand];
    if(subCommand){
      return subCommand.exec(ctx);
    }
    else{
      throw new Error(`Workspace sub-command "${ctx.subCommand}" is not supported`);
    }
  }
}