import { ITerraformProvider } from ".";
import { ITaskAgent } from "../task-agent";

interface GoogleProviderConfiguration{
  providerGoogleCredentials?: string,
  providerGoogleProject?: string,
  providerGoogleRegion?: string,
}

export default class GoogleProvider implements ITerraformProvider {
  constructor(
    private readonly agent: ITaskAgent,
    private readonly config: GoogleProviderConfiguration) {
  }

  isDefined(): boolean{
    if(this.config.providerGoogleCredentials
      || this.config.providerGoogleProject
      || this.config.providerGoogleRegion)
      {
        return true;
      }
      else{
        return false;
      }
  }
  
  async init(): Promise<void> {
    if(this.config.providerGoogleCredentials){      
      const credentials = await this.agent.downloadSecureFile(this.config.providerGoogleCredentials);
      process.env['GOOGLE_CREDENTIALS'] = credentials;
    }
    if(this.config.providerGoogleProject){
      process.env['GOOGLE_PROJECT'] = this.config.providerGoogleProject;
    }
    if(this.config.providerGoogleRegion){
      process.env['GOOGLE_REGION'] = this.config.providerGoogleProject;
    }
  }
}