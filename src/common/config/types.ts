import { RuntimeEnvironment } from 'src/common/types/common';

export interface AppConfig {
  env: RuntimeEnvironment;
  port: number;
}

export interface ServicesConfig {
  users: string;
  channels: string;
  invites: string;
}

export interface AWSConfig {
  accessKeyId: string;
  secret: string;
  bucketName: string;
}
