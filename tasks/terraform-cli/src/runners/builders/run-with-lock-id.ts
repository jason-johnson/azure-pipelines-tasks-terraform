import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithLockId extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, 
        private readonly lockId: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.args.push(this.lockId);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withLockId(this: RunnerOptionsBuilder, lockId: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withLockId = function(this: RunnerOptionsBuilder, lockId: string): RunnerOptionsBuilder {
    return new RunWithLockId(this, lockId);
}