import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithAutoApprove extends RunnerOptionsDecorator{
    constructor(builder: RunnerOptionsBuilder) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        if(options.command !== 'apply' && options.command !== 'destroy')
            throw "'-auto-approve option only valid for commands apply and destroy";
        const autoApproveOption = "-auto-approve";
        if(!options.args || (options.args && options.args.indexOf(autoApproveOption) === -1)){
            options.args.push(autoApproveOption);
        }
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withAutoApprove(this: RunnerOptionsBuilder): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withAutoApprove = function(this: RunnerOptionsBuilder): RunnerOptionsBuilder {
    return new RunWithAutoApprove(this);
}