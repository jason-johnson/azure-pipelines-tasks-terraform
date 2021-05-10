import { ITaskContext } from '../context';

export interface TerraformBackendInitResult{
    args: string[];
}
export interface ITerraformBackend{
    init(ctx: ITaskContext): Promise<TerraformBackendInitResult>;
}
export enum BackendTypes{
    local = "local",
    azurerm = "azurerm",
    selfConfigured = "self-configured"
}

export { default as AzureRMBackend } from './azurerm';