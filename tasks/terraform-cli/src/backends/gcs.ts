import { ITerraformBackend, TerraformBackendInitResult } from ".";
import { ITaskContext } from "../context";
import { ITaskAgent } from "../task-agent";

export default class GcsBackend implements ITerraformBackend {
  constructor(private readonly agent: ITaskAgent) {
  }

  async init(ctx: ITaskContext): Promise<TerraformBackendInitResult> {
    const credentials = await this.agent.downloadSecureFile(ctx.backendGcsCredentials);

    let backendConfig: any = {
      bucket: ctx.backendGcsBucket,
      prefix: ctx.backendGcsPrefix,
      credentials 
    };

    const result = <TerraformBackendInitResult>{
      args: []
    }

    for(var config in backendConfig){
      if(backendConfig[config]){
        result.args.push(`-backend-config=${config}=${backendConfig[config]}`);
      }
    }

    return Promise.resolve(result);
  }
}