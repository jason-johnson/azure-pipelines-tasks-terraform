import { ITaskContext } from '../context';
import { ILogger } from '../logger';
import { IRunner } from '../runners';
import AwsProvider from './aws';
import AzureRMProvider from './azurerm';

export interface ITerraformProvider{
    name: string;
    isDefined(): boolean;
    init(): Promise<void>;
}

export { default as AzureRmProvider } from './azurerm';
export { default as AwsProvider } from './aws';

export class TerraformProviderContext {  
  private readonly providers: ITerraformProvider[];
  private readonly logger: ILogger;

  constructor(logger: ILogger, ...providers: ITerraformProvider[]){
    this.providers = providers;
    this.logger = logger;    
  }

  async init(): Promise<void>{
    const initializedProviders = [];
    for(let i = 0; i < this.providers.length; i++){
      if(this.providers[i].isDefined()){
        await this.providers[i].init();
        initializedProviders.push(this.providers[i].name);
      }
    }
    this.logger.properties["terraform.providers"] = initializedProviders.join(",");
  }
}