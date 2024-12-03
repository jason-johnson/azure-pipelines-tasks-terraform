export interface ITaskAgent {
    downloadSecureFile(secureFileId: string): Promise<string>;
    attachNewPlanFile(workingDirectory: string, type: string, name: string, content: string): void;
    attachNewFile(workingDirectory: string, type: string, name: string, content: string): void;
    writeFile(workingDirectory: string, fileName: string, content: string): string;
}

export { default as AzdoTaskAgent } from './azdo-task-agent';
export { default as MockTaskAgent } from './mock-task-agent';

