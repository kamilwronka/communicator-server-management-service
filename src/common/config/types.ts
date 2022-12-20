import { S3ClientConfig } from '@aws-sdk/client-s3';
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
  s3ClientConfig: S3ClientConfig;
  bucket: string;
}
