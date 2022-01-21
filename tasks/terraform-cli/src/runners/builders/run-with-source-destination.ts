import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithSourceDestination extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, 
        private readonly source: string,
        private readonly destination: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.args.push(this.source, this.destination);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withSourceDestination(this: RunnerOptionsBuilder, source: string, destination: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withSourceDestination = function(this: RunnerOptionsBuilder, source: string, destination: string): RunnerOptionsBuilder {
    return new RunWithSourceDestination(this, source, destination);
}