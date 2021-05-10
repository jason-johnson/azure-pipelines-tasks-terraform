import tasks = require("azure-pipelines-task-lib/task");
import { IToolFactory, IToolRunner } from './index';

export default class AzdoToolFactory implements IToolFactory {
    create(tool: string): IToolRunner {
        const terraformPath = tasks.which(tool, true);
        return tasks.tool(terraformPath);
    }
}
