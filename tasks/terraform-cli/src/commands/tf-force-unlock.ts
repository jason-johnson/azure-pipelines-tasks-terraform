import { CommandResponse, ICommand } from ".";
import { ITaskContext } from "../context";
import { TerraformProviderContext } from "../providers";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskAgent } from "../task-agent";

export class TerraformForceUnlock implements ICommand {
    constructor(
        private readonly taskAgent: ITaskAgent,
        private readonly runner: IRunner,
        private readonly providers: TerraformProviderContext
        ) {
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
      await this.providers.init();      
        const options = await new RunWithTerraform(ctx, undefined, "force-unlock") 
            .withSecureVarFile(this.taskAgent, ctx.secureVarsFileId, ctx.secureVarsFileName)
            .withForce()
            .withLockId(ctx.lockId)
            .build();
        const result = await this.runner.exec(options);

        return result.toCommandResponse();
    }
}
