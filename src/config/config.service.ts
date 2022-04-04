import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as dotenv from 'dotenv';

const client = new SecretManagerServiceClient();
dotenv.config();

export type TConfig = {
  MONGO_CONNECTION_URI: string;
  MONGO_DATABASE: string;
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
    const [versions] = await client.listSecretVersions({
      parent:
        'projects/928190670092/secrets/communicator-dev-server-management-service',
    });

    const secret = await client.accessSecretVersion({
      name: versions[0].name,
    });
    const data = JSON.parse(secret[0].payload.data.toString()) as TConfig;

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

  public isProduction() {
    const env = this.getValue('ENV', false);
    return env !== 'dev';
  }

  public getMongoConnectionConfig() {
    const connectionUri = this.config.MONGO_CONNECTION_URI;
    const database = this.config.MONGO_DATABASE;

    return { connectionUri, database };
  }
}

const configService = new ConfigService(process.env);

export { configService };
