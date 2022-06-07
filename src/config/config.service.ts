import { retrieveSecret } from '@communicator/common';
import * as dotenv from 'dotenv';

dotenv.config();

export type TConfig = {
  MONGO_CONNECTION_URI: string;
  MONGO_DATABASE: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
};
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}
  config: TConfig = {} as TConfig;

  public async setup(keys: string[]) {
    this.ensureValues(keys);
    await this.retrieveSecrets();

    return this;
  }

  public async retrieveSecrets() {
    const data = await retrieveSecret<TConfig>(
      'projects/464228375192/secrets/communicator-dev-servers',
    );

    this.config = data;
  }

  public getConfig() {
    return this.config;
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getEnvironment() {
    return this.getValue('ENV', false);
  }

  public getPubSubConfig() {
    const env = this.getEnvironment();

    return {
      topic: `gateway-${env}`,
      subscription: `gateway-${env}-sub`,
      client: {
        projectId: 'vaulted-acolyte-348710',
      },
    };
  }

  public getMongoConnectionConfig() {
    const connectionUri = this.config.MONGO_CONNECTION_URI;
    const database = this.config.MONGO_DATABASE;

    return { connectionUri, database };
  }

  public getLivekitConfig() {
    const livekitApiKey = this.config.LIVEKIT_API_KEY;
    const livekitApiSecret = this.config.LIVEKIT_API_SECRET;

    return { livekitApiKey, livekitApiSecret };
  }
}

const configService = new ConfigService(process.env);

export { configService };
