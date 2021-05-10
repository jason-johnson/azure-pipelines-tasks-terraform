import { AzdoTaskContext } from './context'
import { AzdoRunner, AzdoToolFactory } from "./runners";
import { AzdoTaskAgent } from './task-agent';
import { Task } from "./task";
import * as tasks from 'azure-pipelines-task-lib';
import ai = require('applicationinsights');
import ApplicationInsightsLogger from './logger/ai-logger';
import TaskLogger from './logger/task-logger';
import { CommandResponse, CommandStatus } from './commands';

const allowTelemetryCollection =  tasks.getBoolInput("allowTelemetryCollection")
if(allowTelemetryCollection) {
    ai.setup(tasks.getInput("aiInstrumentationKey"))
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoDependencyCorrelation(true)
        .setInternalLogging(false)
        .start();

    ai.defaultClient.commonProperties = <any>{
        'system.teamfoundationcollectionuri': tasks.getVariable("System.TeamFoundationCollectionUri"),
        'system.teamproject': tasks.getVariable("System.TeamProject"),
        'system.hosttype': tasks.getVariable("System.HostType"),
        'agent.os': tasks.getVariable("Agent.OS"),
        'agent.osarchitecture': tasks.getVariable("Agent.OSArchitecture"),
        'agent.jobstatus': tasks.getVariable("Agent.JobStatus")
    }
}

const taskContext = new AzdoTaskContext();
const toolFactory = new AzdoToolFactory();
const taskLogger = new TaskLogger(taskContext, tasks);
const aiLogger = new ApplicationInsightsLogger(taskContext, taskLogger, ai.defaultClient);
const runner = new AzdoRunner(toolFactory, aiLogger);
const taskAgent = new AzdoTaskAgent();
const task = new Task(taskContext, runner, taskAgent, aiLogger);

task.exec()
    .then((response: CommandResponse) => {     
        switch(response.status){
            case CommandStatus.Failed:
                tasks.setResult(tasks.TaskResult.Failed, response.message || "");
                break;
            case CommandStatus.SuccessWithIssues:
                tasks.setResult(tasks.TaskResult.SucceededWithIssues, response.message || "");
                break;
            case CommandStatus.SuccessWithIssues:
                tasks.setResult(tasks.TaskResult.Succeeded, response.message || "");
                break;
        }
        if(allowTelemetryCollection){
            ai.defaultClient.flush();
        }            
    })
    .catch((error) => {
        tasks.setResult(tasks.TaskResult.Failed, error);
        if(allowTelemetryCollection){
            ai.defaultClient.flush();
        }        
    });