import { RunnerOptions } from "..";

export abstract class RunnerOptionsBuilder {
    abstract build(): Promise<RunnerOptions>;
}

export abstract class RunnerOptionsDecorator extends RunnerOptionsBuilder{
    constructor(protected readonly builder: RunnerOptionsBuilder){
        super();
    }
}

export { default as RunWithAutoApprove } from './run-with-auto-approve';
export { default as RunWithAzCli } from "./run-with-azcli";
export { default as RunWithBackend } from './run-with-backend';
export { default as RunWithCommandOptions } from './run-with-command-options';
export { default as RunWithForce } from './run-with-force';
export { default as RunWithDetailedExitCode } from "./run-with-forced-detailed-exit-code";
export { default as RunWithJsonOutput } from './run-with-json-output';
export { default as RunWithLockId } from './run-with-lock-id';
export { default as RunWithOptions } from './run-with-options';
export { default as RunWithPlanOrStateFile } from './run-with-plan-or-state-file';
export { default as RunWithProvider } from './run-with-provider';
export { default as RunWithRawOutputs } from "./run-with-raw-outputs";
export { default as RunWithResourceTarget } from './run-with-resource-target';
export { default as RunWithSecureVarFile } from './run-with-secure-var-file';
export { default as RunWithSuccessCodes } from './run-with-success-codes';
export { default as RunWithTerraform } from "./run-with-terraform";
export { default as RunWithWorkspace } from "./run-with-workspace";
export { default as RunWithOutputArguments } from "./run-with-output-arguments";
