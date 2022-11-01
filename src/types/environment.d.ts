import { EEnvironment } from './config/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      ENV: EEnvironment;
      CDN_URL: string;

      MONGODB_PASSWORD: string;
      MONGODB_USER: string;
      MONGODB_HOST: string;
      MONGODB_ACCESS_PORT: number;
      MONGODB_DATABASE: string;

      CLOUDFLARE_ACCOUNT_ID: string;
      CLOUDFLARE_ACCESS_KEY_ID: string;
      CLOUDFLARE_SECRET_ACCESS_KEY: string;
      CLOUDFLARE_R2_BUCKET_NAME: string;

      LIVEKIT_API_KEY: string;
      LIVEKIT_API_SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
