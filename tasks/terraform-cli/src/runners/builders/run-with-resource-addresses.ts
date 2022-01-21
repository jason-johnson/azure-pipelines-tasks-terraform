import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithResourceAddresses extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, 
        private readonly resourceAddresses: string[],) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        this.resourceAddresses.forEach(address => options.args.push(address));
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withResourceAddresses(this: RunnerOptionsBuilder, resourceAddresses: string[]): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withResourceAddresses = function(this: RunnerOptionsBuilder, resourceAddresses: string[]): RunnerOptionsBuilder {
    return new RunWithResourceAddresses(this, resourceAddresses);
}