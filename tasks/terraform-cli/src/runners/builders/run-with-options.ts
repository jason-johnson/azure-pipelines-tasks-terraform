import { RunnerOptionsBuilder, RunnerOptionsDecorator } from ".";
import { RunnerOptions } from "..";

export default class RunWithOptions extends RunnerOptionsDecorator{

    constructor(
        builder: RunnerOptionsBuilder, 
        private readonly commandOptions: string | undefined, 
        private readonly optionsToAdd: string[]) {
        super(builder);
    }
    async build(): Promise<RunnerOptions> {   
        const options = await this.builder.build();

        this.optionsToAdd.forEach((opt) => {
            if(
                (!options.args || (options.args && options.args.indexOf(opt) === -1)) && 
                (!this.commandOptions || !this.commandOptions.includes(opt))
                ){
                options.args.push(opt);
            }    
        })
        return options;
    }
}

declare module "." {
    interface RunnerOptionsBuilder {
        withOptions(this: RunnerOptionsBuilder, commandOptions: string | undefined, optionsToAdd: string[]): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withOptions = function(this: RunnerOptionsBuilder, commandOptions: string | undefined, optionsToAdd: string[]): RunnerOptionsBuilder {
    return new RunWithOptions(this, commandOptions, optionsToAdd);
}