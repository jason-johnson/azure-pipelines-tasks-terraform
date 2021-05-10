import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithSuccessCodes extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly successCodes: number[]) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.successfulExitCodes = this.successCodes;
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withSuccessCodes(this: RunnerOptionsBuilder, successCodes: number[]): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withSuccessCodes = function(this: RunnerOptionsBuilder, successCodes: number[]): RunnerOptionsBuilder {
    return new RunWithSuccessCodes(this, successCodes);
}