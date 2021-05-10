import { TelemetryClient } from "applicationinsights";
import { RequestTelemetry, ExceptionTelemetry } from "applicationinsights/out/Declarations/Contracts";
import { ILogger } from ".";
import { ITaskContext } from "../context";

export default class ApplicationInsightsLogger implements ILogger{
    constructor(
        private readonly ctx: ITaskContext, 
        private readonly logger: ILogger, 
        private readonly telemetry: TelemetryClient){
    }

    command(success: boolean, duration: number): void {
        if(this.ctx.allowTelemetryCollection){
            const properties: { [key: string]: any } = {
                "terraform.version" : this.ctx.terraformVersionFull,
                "terraform.version.major" : this.ctx.terraformVersionMajor,
                "terraform.version.minor" : this.ctx.terraformVersionMinor,
                "terraform.version.patch" : this.ctx.terraformVersionPatch,
            }

            this.telemetry.trackRequest(<RequestTelemetry>{
                name: this.ctx.name,
                success: success,
                resultCode: success ? 200 : 500,
                duration: duration,
                properties
            });
        }        
        this.logger.command(success, duration);
    }
    error(error: string | Error, properties: any): void {
        if(this.ctx.allowTelemetryCollection){            
            this.telemetry.trackException(<ExceptionTelemetry>{
                exception: error instanceof Error ? <Error>error : new Error(error.toString()),
                properties,
            });
        }
        this.logger.error(error, properties);
    }

    warning(message: string): void {
        this.logger.warning(message);
    }

    debug(message: string): void {
        this.logger.debug(message);
    }
}