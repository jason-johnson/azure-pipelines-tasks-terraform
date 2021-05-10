import { IExecOptions } from 'azure-pipelines-task-lib/toolrunner';

export class RunnerOptions{
    private _args: string[];
    constructor(
        public readonly tool: string,
        public readonly command: string,
        public readonly cwd?: string,
        public readonly silent?: boolean | undefined,
        public readonly path: string[] = [],
        args: string[] = [],
        public successfulExitCodes: number[] = [0],
        public rawOutput?: boolean | false,
    ){  
        this._args = args;
    }

    get args() {
        return this._args;
    }
    addArgs(...args: string[]){
        this._args = this._args.concat(args);
    }
    concatArgs(args: string[]){
        this._args = this._args.concat(args);
    }
}

export class RunnerResult {
    constructor(
    public readonly exitCode: number,
    public readonly stdout: string,
    public readonly stderr: string,
    public readonly successfulExitCodes: number[]
    ){}
}

export interface IRunner{
    exec(options: RunnerOptions): Promise<RunnerResult>;
}

export interface IToolRunner {
    arg(val: string | string[]): this;
    line(val: string): this;
    exec(options: IExecOptions): Q.Promise<number>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface IToolFactory {
    create(tool: string): IToolRunner
}

export { default as AzdoRunner } from './azdo-runner';
export { default as AzdoToolFactory } from './azdo-tool-factory';
export { TerraformAggregateError, TerraformError } from './terraform-error';

