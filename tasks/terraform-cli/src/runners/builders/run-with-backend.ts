import { RunnerOptions } from "..";
import { RunnerOptionsDecorator, RunnerOptionsBuilder } from ".";
import { ITerraformBackend } from "../../backends";
import { ITaskContext } from "../../context";

export default class RunWithBackend extends RunnerOptionsDecorator{
    constructor(
        builder: RunnerOptionsBuilder, 
        private readonly ctx: ITaskContext, 
        private readonly backend?: ITerraformBackend) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        if(this.backend){
            const result = await this.backend.init(this.ctx);
            options.addArgs(...result.args);      
        }
        return options;
    }
}

declare module "."{
    interface RunnerOptionsBuilder{
        withBackend(this: RunnerOptionsBuilder, ctx: ITaskContext, backend?: ITerraformBackend): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withBackend = function(this: RunnerOptionsBuilder, ctx: ITaskContext, backend?: ITerraformBackend): RunnerOptionsBuilder {
    return new RunWithBackend(this, ctx, backend);
}
