import { ICommand, CommandResponse } from ".";
import { IRunner, RunnerOptions } from "../runners";
import { ITaskContext } from "../context";
import { ILogger } from "../logger";

const versionRe = /([0-9]+)\.([0-9]+)\.([0-9]+)?/;
const versionOutOfDate = /Your version of Terraform is out of date! The latest version\r?\nis ([0-9]+\.[0-9]+\.[0-9]+)\./;

export class TerraformVersion implements ICommand {
    private readonly runner: IRunner;
    private readonly logger: ILogger

    constructor(runner: IRunner, logger: ILogger){
        this.runner = runner,
        this.logger = logger;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = new RunnerOptions("terraform", "version", ctx.cwd);
        const result = await this.runner.exec(options);
        const version = result.stdout.match(versionRe);
        if(version){
            ctx.setTerraformVersion(version[0], Number.parseInt(version[1]), Number.parseInt(version[2]), Number.parseInt(version[3]))
        }
        if(ctx.name === "version"){
            const outOfDate = result.stdout.match(versionOutOfDate);
            if (outOfDate !== null){
                this.logger.warning("Your version of Terraform is out of date! The latest version is " + String(outOfDate[1]));
            }
        }

        return result.toCommandResponse();
    }
}
