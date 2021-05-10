import { RunnerOptionsBuilder } from ".";
import { RunnerOptions } from "..";

export default class RunWithAzCli extends RunnerOptionsBuilder {
    constructor(
        private readonly command: string,
        private readonly path: string[] = [],
        private readonly cwd?: string,
        private readonly silent?: boolean
    ) {
        super();
    }
    build(): Promise<RunnerOptions> {
        return Promise.resolve(
            new RunnerOptions("az", this.command, this.cwd, this.silent, this.path)
        )
    }
}