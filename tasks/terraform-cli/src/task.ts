import * as commands from "./commands";
import { ITaskContext } from "./context";
import { ILogger } from "./logger";
import { AwsProvider, AzureRmProvider, TerraformProviderContext } from "./providers";
import { IRunner } from "./runners";
import { ITaskAgent } from "./task-agent";

export class Task {
    private readonly commands: { [name: string]: commands.ICommand };

    constructor(
      private readonly ctx: ITaskContext,
      runner: IRunner, 
      taskAgent: ITaskAgent, 
      private readonly logger: ILogger){
        const providers = new TerraformProviderContext(
          logger,
          new AzureRmProvider(runner, ctx),
          new AwsProvider(ctx)
        )
        this.commands = {    
          "version": new commands.VersionCommandHandler(runner, logger),
          "validate": new commands.ValidateCommandHandler(taskAgent, runner),
          "init": new commands.InitCommandHandler(taskAgent, runner, logger),
          "plan": new commands.PlanCommandHandler(taskAgent, runner,logger, providers),
          "apply": new commands.ApplyCommandHandler(taskAgent, runner, providers),
          "destroy": new commands.DestroyCommandHandler(taskAgent, runner, providers),
          "import": new commands.ImportCommandHandler(taskAgent, runner, providers),
          "refresh": new commands.RefreshCommandHandler(taskAgent, runner, providers),
          "output": new commands.OutputCommandHandler(runner, logger),
          "forceunlock": new commands.ForceUnlockCommandHandler(taskAgent, runner, providers),
          "show": new commands.ShowCommandHandler(taskAgent, runner, logger),
          "fmt": new commands.FormatCommandHandler(runner),
          "workspace": new commands.WorkspaceCommandHandler({
            "select": new commands.WorkspaceSelectCommandHandler(runner),
            "new": new commands.WorkspaceNewCommandHandler(runner)
          })
        }
    }

    async exec(): Promise<commands.CommandResponse> {
      let command = this.commands[this.ctx.name];

        if(!command){
            throw new Error(`Support for command "${this.ctx.name}" is not implemented`);
        }

        let response: commands.CommandResponse | undefined;
        try{
            if(this.ctx.name !== 'version'){
                let version = this.commands['version'];
                response = await version.exec(this.ctx);
            }
            response = await command.exec(this.ctx);
        }
        catch(err){
            response = new commands.CommandResponse(commands.CommandStatus.Failed, err?.toString(), 1);
            this.logger.error(err)
        }
        finally{
            this.ctx.finished();
            this.logger.command(response?.status !== commands.CommandStatus.Failed, this.ctx.runTime);
            if(response && response.lastExitCode !== undefined){
                this.ctx.setVariable("TERRAFORM_LAST_EXITCODE", response.lastExitCode.toString());
            }
        }
        return response;
    }
}
