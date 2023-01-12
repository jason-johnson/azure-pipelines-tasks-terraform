import { ILogger } from ".";
import { ITaskContext, getTrackedProperties } from "../context";

export default class TaskLogger implements ILogger {    
    constructor(
        private readonly ctx: ITaskContext, 
        private readonly tasks: any){
    }    

    command(success: boolean, duration: number): void {
        this.tasks.debug(`executed command '${this.ctx.name}'`, {
            name: this.ctx.name,
            success: success,
            resultCode: success ? 200 : 500,
            duration: duration,
            properties: getTrackedProperties(this.ctx)
        })
    }

    error(message: string): void {
        this.tasks.error(message);
    }

    warning(message: string): void {
        this.tasks.warning(message);
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }
}