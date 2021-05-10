import { RunnerOptions } from "..";
import { RunnerOptionsDecorator, RunnerOptionsBuilder } from ".";
import { ITaskContext } from "../../context";
import { ITerraformProvider } from "../../providers";

export default class RunWithProvider extends RunnerOptionsDecorator{
    constructor(
        builder: RunnerOptionsBuilder, 
        private readonly ctx: ITaskContext, 
        private readonly provider?: ITerraformProvider) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();
        if(this.provider){
            await this.provider.init(this.ctx);   
        }
        return options;
    }
}

declare module "."{
    interface RunnerOptionsBuilder{
        withProvider(this: RunnerOptionsBuilder, ctx: ITaskContext, provider?: ITerraformProvider): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withProvider = function(this: RunnerOptionsBuilder, ctx: ITaskContext, provider?: ITerraformProvider): RunnerOptionsBuilder {
    return new RunWithProvider(this, ctx, provider);
}
