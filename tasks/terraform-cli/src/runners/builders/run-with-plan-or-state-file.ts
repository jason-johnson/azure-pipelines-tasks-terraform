import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithPlanOrStateFile extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder, private readonly planOrStateFile: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        options.args.push(this.planOrStateFile);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withPlanOrStateFile(this: RunnerOptionsBuilder, planOrStateFile: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withPlanOrStateFile = function(this: RunnerOptionsBuilder, planOrStateFile: string): RunnerOptionsBuilder {
    return new RunWithPlanOrStateFile(this, planOrStateFile);
}