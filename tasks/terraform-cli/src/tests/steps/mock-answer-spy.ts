import * as ma from 'azure-pipelines-task-lib/mock-answer'

export { TaskLibAnswerExecResult } from 'azure-pipelines-task-lib/mock-answer'
export { TaskLibAnswers } from 'azure-pipelines-task-lib/mock-answer'
export { MockedCommand } from 'azure-pipelines-task-lib/mock-answer'

export const requestedAnswers: { [key: string]: string[] } = {};

export class MockAnswers {
    private readonly mockAnswers: ma.MockAnswers;
    constructor(){
        this.mockAnswers = new ma.MockAnswers();
    }

    public initialize(answers: ma.TaskLibAnswers){
        this.mockAnswers.initialize(answers);
    }

    public getResponse(cmd: ma.MockedCommand, key: string, debug: (message: string) => void): any {
        if(!requestedAnswers[cmd]){
            requestedAnswers[cmd] = [];
        }
        requestedAnswers[cmd].push(key);
        let response = this.mockAnswers.getResponse(cmd, key, debug);
        if(!response && cmd == `exec`){
            throw new Error(`No exec answer found for command "${key}". Make sure to mock answer for commands!`);
        }
        return response;
    }
}

export function resetRequestedAnswers(){
    for(let k in requestedAnswers){
        delete requestedAnswers[k];
    }
}