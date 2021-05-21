import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithOutputArguments extends RunnerOptionsDecorator{
    constructor(
        builder: RunnerOptionsBuilder,
        private readonly outputName: string | undefined
        ) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {
        const options = await this.builder.build();
        if (this.outputName !== undefined) {
            options.args.push(this.outputName);
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withOutputArguments(this: RunnerOptionsBuilder, outputName: string | undefined): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withOutputArguments = function(this: RunnerOptionsBuilder, outputName: string | undefined): RunnerOptionsBuilder {
    return new RunWithOutputArguments(this, outputName);
}
