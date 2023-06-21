import { RuntimeEnvironment } from './common';
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENV: RuntimeEnvironment;

      MONGODB_PASSWORD: string;
      MONGODB_USER: string;
      MONGODB_HOST: string;
      MONGODB_ACCESS_PORT: number;
      MONGODB_DATABASE: string;

      AWS_REGION: string;
      AWS_S3_BUCKET_NAME: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;

      LIVEKIT_API_KEY: string;
      LIVEKIT_API_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
