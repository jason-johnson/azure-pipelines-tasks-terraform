import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithWorkspace extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly workspaceName: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.addArgs(this.workspaceName)
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withWorkspace(this: RunnerOptionsBuilder, workspaceName: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withWorkspace = function(this: RunnerOptionsBuilder, workspaceName: string): RunnerOptionsBuilder {
    return new RunWithWorkspace(this, workspaceName);
}