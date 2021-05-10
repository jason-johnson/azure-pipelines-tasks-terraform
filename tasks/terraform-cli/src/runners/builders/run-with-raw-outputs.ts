// This will prevent processing of the std(out|err) in the runner
// to be returned as is.

import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithRawOutputs extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.rawOutput = true
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withRawOutputs(this: RunnerOptionsBuilder): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withRawOutputs = function(this: RunnerOptionsBuilder): RunnerOptionsBuilder {
    return new RunWithRawOutputs(this);
}