import { MockTaskAgent } from "../../task-agent";
import * as ma from "azure-pipelines-task-lib/mock-answer";
import * as tasks from "azure-pipelines-task-lib/mock-task";
import MockToolFactory, { setAnswers } from "../../runners/mock-tool-factory";
import { AzdoRunner } from "../../runners";
import { Task } from "../../task";
import { CommandResponse } from "../../commands";
import { ITaskContext } from "../../context";
import intercept from 'intercept-stdout';
import TaskLogger from "../../logger/task-logger";
import MockLogger from "../../logger/mock-logger";

export default class TaskRunner {
    error?: Error;
    response?: CommandResponse;
    logs: string[] = [];
    public readonly taskAgent: MockTaskAgent;
    public logger?: MockLogger;

    constructor() {        
        this.taskAgent = new MockTaskAgent();
    }

    public async run(taskContext: ITaskContext, taskAnswers: ma.TaskLibAnswers) {        
        const toolFactory = new MockToolFactory();
        this.logger = new MockLogger(new TaskLogger(taskContext, tasks));
        const runner = new AzdoRunner(toolFactory, this.logger);
        const task = new Task(taskContext, runner, this.taskAgent, this.logger);
        setAnswers(taskAnswers);
        try{
            //separate the stdout from task and cucumbers test
            const unhook_intercept = intercept((text: string) => {
                this.logs.push(text);
                return '';
            })
            this.response = await task.exec();
            unhook_intercept();
        }
        catch(error){
            this.error = error;
        }
    }
}