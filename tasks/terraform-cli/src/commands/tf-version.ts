import { ICommand, CommandResponse } from ".";
import { IRunner, RunnerOptions } from "../runners";
import { ITaskContext } from "../context";

const versionRe = /([0-9]+)\.([0-9]+)\.([0-9]+)?/;

export class TerraformVersion implements ICommand {    
    private readonly runner: IRunner;

    constructor(runner: IRunner){
        this.runner = runner;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = new RunnerOptions("terraform", "version", ctx.cwd);
        const result = await this.runner.exec(options);
        const version = result.stdout.match(versionRe);
        if(version){
            ctx.setTerraformVersion(version[0], Number.parseInt(version[1]), Number.parseInt(version[2]), Number.parseInt(version[3]))
        }
        return result.toCommandResponse();
    }
}