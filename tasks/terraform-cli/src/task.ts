import * as commands from "./commands";
import { ITaskContext } from "./context";
import { ILogger } from "./logger";
import { IRunner } from "./runners";
import { ITaskAgent } from "./task-agent";

export class Task {
    private readonly runner: IRunner;
    private readonly taskAgent: ITaskAgent;
    private readonly ctx: ITaskContext;
    private readonly logger: ILogger;

    private readonly commandResolvers: { [key: string]: string} = {
        "version": "version",
        "validate": "validate",
        "init": "init",
        "plan": "plan",
        "apply": "apply",
        "destroy": "destroy",
        "import": "import",
        "refresh": "refresh",
        "output": "output",
        "forceunlock": "forceUnlock",
        "show": "show",
        "fmt": "fmt",
        "workspace" : "workspace"
    }
    
    constructor(ctx: ITaskContext, runner: IRunner, taskAgent: ITaskAgent, logger: ILogger){        
        this.ctx = ctx;
        this.runner = runner;
        this.taskAgent = taskAgent;
        this.logger = logger;
    }     

    async exec(): Promise<commands.CommandResponse> {
        let handlerName = this.commandResolvers[this.ctx.name];

        if(!handlerName){
            throw new Error(`Support for command "${this.ctx.name}" is not implemented`);
        }
        
        let response: commands.CommandResponse | undefined;        
        try{
            const command = <commands.ICommand>(<any>this)[handlerName]();
            
            if(this.ctx.name !== 'version'){
                response = await this.version().exec(this.ctx);
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

    version(): commands.ICommand {
        return new commands.VersionCommandHandler(this.runner);
    }

    init(): commands.ICommand {
        return new commands.InitCommandHandler(this.taskAgent, this.runner);
    }

    validate(): commands.ICommand {
        return new commands.ValidateCommandHandler(this.taskAgent, this.runner);
    }

    plan(): commands.ICommand {
        return new commands.PlanCommandHandler(this.taskAgent, this.runner,this.logger);
    }

    apply(): commands.ICommand {
        return new commands.ApplyCommandHandler(this.taskAgent, this.runner);
    }

    destroy(): commands.ICommand {
        return new commands.DestroyCommandHandler(this.taskAgent, this.runner);
    }  

    import(): commands.ICommand {
        return new commands.ImportCommandHandler(this.taskAgent, this.runner);
    }

    output(): commands.ICommand {
        return new commands.OutputCommandHandler(this.runner, this.logger);
    }

    refresh(): commands.ICommand {
        return new commands.RefreshCommandHandler(this.taskAgent, this.runner);
    }

    forceUnlock(): commands.ICommand {
        return new commands.ForceUnlockCommandHandler(this.taskAgent, this.runner);
    }
    
    show(): commands.ICommand {
        return new commands.ShowCommandHandler(this.taskAgent, this.runner, this.logger);
    }

    fmt(): commands.ICommand {
        return new commands.FormatCommandHandler(this.runner);
    }

    workspace(): commands.ICommand {
        switch(this.ctx.workspaceSubCommand){
            case "select":
                return new commands.WorkspaceSelectCommandHandler(this.runner);
            case "new":
                return new commands.WorkspaceNewCommandHandler(this.runner);
            default:
                throw new Error(`Workspace sub-command "${this.ctx.workspaceSubCommand}" is not supported`);
        }        
    }
}