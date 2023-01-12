export interface ILogger {
    command(success: boolean, duration: number, customProperties?: { [key:string]: string }): void;
    error(error: string | Error, properties?: any): void;
    warning(message: string): void;
    debug(message: string): void;
}