export enum EEnvironment {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export interface IAppConfig {
  env: string;
  port: number;
}

export interface IMongoConfig {
  port: number;
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface IServicesConfig {
  users: string;
  cdn: string;
  channels: string;
}

export interface ICloudflareConfig {
  apiKey: string;
  secret: string;
  accountId: string;
  bucketName: string;
}

export interface ILivekitConfig {
  apiKey: string;
  secret: string;
}
