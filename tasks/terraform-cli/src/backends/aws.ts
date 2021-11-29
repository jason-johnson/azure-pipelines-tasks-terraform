import { ITerraformBackend, TerraformBackendInitResult } from ".";
import { ITaskContext } from "../context";

export default class AwsBackend implements ITerraformBackend {
  async init(ctx: ITaskContext): Promise<TerraformBackendInitResult> {
    let backendConfig: any = {
      bucket: ctx.backendAwsBucket,
      key: ctx.backendAwsKey,
      region: ctx.backendAwsRegion,
      access_key: ctx.backendServiceAwsAccessKey,
      secret_key: ctx.backendServiceAwsSecretKey
    }

    const result = <TerraformBackendInitResult>{
      args: []
    }

    for(var config in backendConfig){
      if(config){
        result.args.push(`-backend-config=${config}=${backendConfig[config]}`);
      }
    }

    return Promise.resolve(result);
  }
}