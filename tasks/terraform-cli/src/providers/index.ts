import { ITaskContext } from '../context';

export interface ITerraformProvider{
    init(ctx: ITaskContext): Promise<void>;
}

export { default as AzureRmProvider } from './azurerm'