import path from "path";
import { ITaskAgent } from ".";
import { v4 as uuidv4 } from 'uuid';

export default class TaskAgentMock implements ITaskAgent {
    attachNewPlanFile(workingDirectory: string, type: string, name: string, content: string): void {
        const fileName = `default_stage_default_job_${uuidv4()}`;
        const filePath = this.writeFile(workingDirectory, fileName, content);
        this.attachedFiles[name] = { type: type, path: filePath };
        this.attachedTypes[type] = { [name]: filePath};
    }
    public readonly attachedFiles: { [name: string]: { type: string, path: string } } = {};
    public readonly attachedTypes: { [type: string]: { [ name: string ]: string } } = {}
    public readonly writtenFiles: { [path: string]: string } = {};

    attachNewFile(workingDirectory: string, type: string, name: string, content: string): void {
        const filePath = this.writeFile(workingDirectory, name, content);
        this.attachedFiles[name] = { type: type, path: filePath };
        this.attachedTypes[type] = { [name]: filePath};
    }

    writeFile(workingDirectory: string, fileName: string, content: string): string {
        const filePath = path.join(workingDirectory, fileName);
        this.writtenFiles[filePath] = content;
        return filePath;
    }

    async downloadSecureFile(secureFileId: string): Promise<string> {
        const secureFileEnv = `SECUREFILE_NAME_${secureFileId}`;        
        const filePath = process.env[secureFileEnv];

        if(!filePath){
            throw `Secure file ${secureFileId} not found. Did you add 'inputSecureFile' into your scenario pipeline?`
        }
        
        return Promise.resolve(filePath);
    }
}

