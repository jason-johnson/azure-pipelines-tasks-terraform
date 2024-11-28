import { ILogger } from '../logger';

export interface ITerraformProvider{
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
    process.env['TF_IN_AUTOMATION']        = 'True';
    
    for(let i = 0; i < this.providers.length; i++){
      if(this.providers[i].isDefined()){
        await this.providers[i].init();
      }
    }
  }
}