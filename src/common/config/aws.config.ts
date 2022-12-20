import { registerAs } from '@nestjs/config';
import { AWSConfig } from './types';

export default registerAs('aws', (): AWSConfig => {
  const { AWS_ACCESS_KEY_ID, AWS_S3_BUCKET_NAME, AWS_SECRET_ACCESS_KEY } =
    process.env;

  return {
    s3ClientConfig: {
      region: 'eu-central-1',
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    },
    bucket: AWS_S3_BUCKET_NAME,
  };
});
