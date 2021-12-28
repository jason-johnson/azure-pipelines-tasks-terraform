import { ITaskContext } from '../context';
import { IRunner } from '../runners';
import AwsProvider from './aws';
import AzureRMProvider from './azurerm';

export interface ITerraformProvider{
    isDefined(): boolean;
    init(): Promise<void>;
}

export { default as AzureRmProvider } from './azurerm';
export { default as AwsProvider } from './aws';

export class TerraformProviderContext {  
  private readonly providers: ITerraformProvider[];

  constructor(...providers: ITerraformProvider[]){
    this.providers = providers;
  }

  async init(): Promise<void>{
    const tasks: Promise<void>[] = [];
    for(let i = 0; i < this.providers.length; i++){
      if(this.providers[i].isDefined()){
        await this.providers[i].init();
      }
    }
    await Promise.all(tasks);
  }
}