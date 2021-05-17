import { ILogger } from ".";

export default class MockLogger implements ILogger {
    commands: { success: boolean; duration: number; }[] = [];
    errors: { error: string | Error; properties?: any; }[] = [];
    warnings: string[] = [];
    debugs: string[] = [];

    constructor(
        private readonly logger: ILogger) {
    }

    command(success: boolean, duration: number): void {
        this.commands.push({ success, duration });
        this.logger.command(success, duration);
    }
    error(error: string | Error, properties?: any): void {
        this.errors.push({ error, properties });
        this.logger.error(error, properties);
    }
    warning(message: string): void {
        this.warnings.push(message);
        this.logger.warning(message);
    }
    debug(message: string): void {
        this.debugs.push(message);
        this.logger.debug(message);
    }

}
