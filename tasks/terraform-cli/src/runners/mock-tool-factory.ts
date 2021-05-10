import * as tasks from 'azure-pipelines-task-lib/mock-task';
import { IToolFactory, IToolRunner } from './index';

export default class MockToolFactory implements IToolFactory {
    create(tool: string): IToolRunner {        
        const terraformPath = tasks.which(tool, true);
        return <IToolRunner>tasks.tool(terraformPath);
    }
}

export { setAnswers } from 'azure-pipelines-task-lib/mock-task';