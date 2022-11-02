import { registerAs } from '@nestjs/config';
import { IServicesConfig } from './types';

export default registerAs('services', (): IServicesConfig => {
  const { ENV, CDN_URL } = process.env;

  const isLocal = ENV === 'local';
  const mockSvcUrl = 'http://mockserver.mockserver:1080';

  let config: IServicesConfig;

  if (isLocal) {
    config = {
      users: `${mockSvcUrl}/users`,
      cdn: CDN_URL,
      // channels: `${mockSvcUrl}/channels`,
      channels: 'http://channels:4000',
    };
  } else {
    config = {
      users: 'http://users:4000',
      channels: 'http://channels:4000',
      cdn: CDN_URL,
    };
  }

  return config;
});
