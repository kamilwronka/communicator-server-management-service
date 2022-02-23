require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

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
    return env !== 'DEV';
  }

  public getRMQConfig() {
    const rmqPort = this.getValue('RMQ_PORT', false);
    const rmqHost = this.getValue('RMQ_HOST', false);
    const rmqQueue = this.getValue('RMQ_QUEUE', false);

    return { rmqHost, rmqPort, rmqQueue };
  }

  public getMongoConnectionUri() {
    const connectionUri = this.getValue('MONGO_CONNECTION_URI', false);

    return { connectionUri };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'RMQ_HOST',
  'RMQ_PORT',
  'RMQ_QUEUE',
  'PORT',
  'MONGO_CONNECTION_URI',
]);

export { configService };
