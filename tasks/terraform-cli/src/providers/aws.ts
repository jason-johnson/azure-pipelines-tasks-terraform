import { ITerraformProvider } from ".";

interface AwsProviderConfiguration{
  providerServiceAws?: string,
  providerServiceAwsAccessKey: string,
  providerServiceAwsSecretKey: string,
  providerAwsRegion?: string
  providerServiceAwsSessionToken?: string
}

export default class AwsProvider implements ITerraformProvider {
  constructor(private readonly config: AwsProviderConfiguration) {
  }

  isDefined(): boolean{
    if(this.config.providerServiceAws){
      return true;
    }
    else{
      return false;
    }
  }
  
  async init(): Promise<void> {
      process.env['AWS_ACCESS_KEY_ID']  = this.config.providerServiceAwsAccessKey;
      process.env['AWS_SECRET_ACCESS_KEY'] = this.config.providerServiceAwsSecretKey;
      process.env['AWS_REGION'] = this.config.providerAwsRegion;
      process.env['AWS_SESSION_TOKEN'] = this.config.providerServiceAwsSessionToken;
  }
}