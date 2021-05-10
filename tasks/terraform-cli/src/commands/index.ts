import { IRunner, RunnerResult } from "../runners";
import { ITaskContext } from "../context";

export interface ICommand {
    exec(ctx: ITaskContext): Promise<CommandResponse>
}

export class CommandResponse {
    constructor(
        public readonly status: CommandStatus, 
        public readonly message?: string,
        public readonly lastExitCode?: number        
    ){}
}

export enum CommandStatus {
    Success = 0,
    SuccessWithIssues = 1,
    Failed = 2
}

export class CommandPipeline {
    private readonly commands: ICommand[] = [];
    constructor(private readonly runner: IRunner) {
    }
    pipe(commandFactory: (runner: IRunner) => ICommand): CommandPipeline {
        const command = commandFactory(this.runner);
        this.commands.push(command);
        return this;
    }
    async exec(ctx: ITaskContext): Promise<void> {
        let command = this.commands.shift();
        while (command) {
            await command.exec(ctx);
            command = this.commands.shift();
        }
    }
}

export { AzLogin as AzLoginHandler } from './az-login';
export { AzAccountSet as AzAccountSetHandler} from './az-account-set';
export { AzGroupCreate as AzGroupCreateHandler} from './az-group-create';
export { AzStorageAccountCreate as AzStorageAccountCreateHandler} from './az-storage-account-create';
export { AzStorageContainerCreate as AzStorageContainerCreateHandler} from './az-storage-container-create';
export { TerraformVersion as VersionCommandHandler } from './tf-version';
export { TerraformInit as InitCommandHandler } from './tf-init';
export { TerraformValidate as ValidateCommandHandler } from './tf-validate';
export { TerraformPlan as PlanCommandHandler } from './tf-plan';
export { TerraformApply as ApplyCommandHandler } from './tf-apply';
export { TerraformDestroy as DestroyCommandHandler } from './tf-destroy';
export { TerraformImport as ImportCommandHandler } from './tf-import';
export { TerraformOutput as OutputCommandHandler } from './tf-output';
export { TerraformRefresh as RefreshCommandHandler } from './tf-refresh';
export { TerraformForceUnlock as ForceUnlockCommandHandler } from './tf-force-unlock';
export { TerraformShow as ShowCommandHandler } from './tf-show';
export { TerraformFormat as FormatCommandHandler } from './tf-fmt';
export { TerraformWorkspaceSelect as WorkspaceSelectCommandHandler } from './tf-workspace-select';

declare module '../runners'{
    interface RunnerResult{
        toCommandResponse(this: RunnerResult) : CommandResponse;
    }
}

RunnerResult.prototype.toCommandResponse = function(this: RunnerResult): CommandResponse {
    if(this.successfulExitCodes.includes(this.exitCode)){
        return new CommandResponse(CommandStatus.Success, undefined, this.exitCode);
    }
    else{
        return new CommandResponse(CommandStatus.Failed, this.stderr, this.exitCode);
    }
}