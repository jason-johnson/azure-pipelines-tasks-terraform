import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithPlanFile extends RunnerOptionsDecorator {
    constructor(builder: RunnerOptionsBuilder, private readonly planFilePath: string) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {
        const options = await this.builder.build();
        options.args.push("-out=" + this.planFilePath);
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withPlanFile(this: RunnerOptionsBuilder, planFilePath: string): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withPlanFile = function(this: RunnerOptionsBuilder, planFilePath: string): RunnerOptionsBuilder {
    return new RunWithPlanFile(this, planFilePath);
}
