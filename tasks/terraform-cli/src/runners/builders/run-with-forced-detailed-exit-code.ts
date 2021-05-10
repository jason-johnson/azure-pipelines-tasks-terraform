import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithForcedDetailedExitCode extends RunnerOptionsDecorator {
    constructor(builder: RunnerOptionsBuilder, private readonly commandOptions: string | undefined, private readonly forceAdd: boolean = true) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {
        const options = await this.builder.build();
        
        if (this.forceAdd) {
            const detailedExitCodeOption = "-detailed-exitcode";
            if ((!options.args || (options.args && options.args.indexOf(detailedExitCodeOption) === -1)) && (!this.commandOptions || !this.commandOptions.includes(detailedExitCodeOption))) {
                options.args.push(detailedExitCodeOption);
            }
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withForcedDetailedExitCode(this: RunnerOptionsBuilder, commandOptions: string | undefined, forceAdd: boolean): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withForcedDetailedExitCode = function (this: RunnerOptionsBuilder, commandOptions: string | undefined, forceAdd: boolean): RunnerOptionsBuilder {
    return new RunWithForcedDetailedExitCode(this, commandOptions, forceAdd);
}