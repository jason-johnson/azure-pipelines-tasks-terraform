import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithForce extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        const forceOption = "-force";
        if(!options.args || (options.args && options.args.indexOf(forceOption) === -1)){
            options.args.push(forceOption);
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withForce(this: RunnerOptionsBuilder): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withForce = function(this: RunnerOptionsBuilder): RunnerOptionsBuilder {
    return new RunWithForce(this);
}