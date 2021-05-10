import { RunnerOptionsBuilder } from ".";
import { RunnerOptions } from "..";
import { ITaskContext } from "../../context";

export default class RunWithTerraform extends RunnerOptionsBuilder {
    constructor(
        protected readonly ctx: ITaskContext,
        protected readonly silent?: boolean,
        protected readonly command?: string,
        protected readonly path?: string[]
    ) {
        super();
    }
    build(): Promise<RunnerOptions> {
        const command = this.command || this.ctx.name;
        return Promise.resolve(
            new RunnerOptions("terraform", command, this.ctx.cwd, this.silent, this.path)
        )
    }
}
