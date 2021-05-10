import { IRunner } from "../runners";
import { ICommand, CommandResponse, CommandPipeline, CommandStatus } from ".";
import { RunWithAzCli } from "../runners/builders";
import { ITaskContext } from "../context";

export class AzStorageAccountCreate implements ICommand {
    constructor(
        private readonly runner: IRunner){
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse>{
        const showOptions = await new RunWithAzCli("show", ["storage", "account"]).build();
        showOptions.addArgs(
            "--name", ctx.backendAzureRmStorageAccountName,
            "--resource-group", ctx.backendAzureRmResourceGroupName
        );
        const showResult = await this.runner.exec(showOptions);
        if(showResult.exitCode !== 0 && showResult.stderr){
            const expectedError: string = `The Resource 'Microsoft.Storage/storageAccounts/${ctx.backendAzureRmStorageAccountName}' under resource group '${ctx.backendAzureRmResourceGroupName}' was not found`;
            if(showResult.stderr.includes(expectedError)){
                console.log("az storage account create: storage account not found, creating...");
            }
            else{                
                throw new Error(showResult.stderr);
            }
        }
        else{
            console.log("az storage account create: storage account already exists");
            return new CommandResponse(CommandStatus.Success, showResult.stdout, showResult.exitCode);
        }

        const createOptions = await new RunWithAzCli("create", ["storage", "account"]).build();        
        createOptions.addArgs(
            "--name", ctx.backendAzureRmStorageAccountName,
            "--resource-group", ctx.backendAzureRmResourceGroupName,
            "--sku", ctx.backendAzureRmStorageAccountSku,
            "--kind", "StorageV2",
            "--encryption-services", "blob",            
            "--access-tier", "hot",
            "--allow-blob-public-access", "false",
            "--https-only", "true",
            "--min-tls-version", "TLS1_2",
        );
        const result = await this.runner.exec(createOptions);
        return result.toCommandResponse();        
    }
}

declare module "." {
    interface CommandPipeline {
        azStorageAccountCreate(this: CommandPipeline): CommandPipeline;
    }
}

CommandPipeline.prototype.azStorageAccountCreate = function(this: CommandPipeline): CommandPipeline {
    return this.pipe((runner: IRunner) => new AzStorageAccountCreate(runner));
}
