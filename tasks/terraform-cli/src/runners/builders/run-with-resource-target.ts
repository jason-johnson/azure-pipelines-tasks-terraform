import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithResourceTarget extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, 
        private readonly resourceAddress: string, 
        private readonly resourceId: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.args.push(this.resourceAddress, this.resourceId);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withResourceTarget(this: RunnerOptionsBuilder, resourceAddress: string, resourceId: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withResourceTarget = function(this: RunnerOptionsBuilder, resourceAddress: string, resourceId: string): RunnerOptionsBuilder {
    return new RunWithResourceTarget(this, resourceAddress, resourceId);
}