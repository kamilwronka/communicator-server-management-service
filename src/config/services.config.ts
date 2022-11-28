import { registerAs } from '@nestjs/config';
import { ServicesConfig } from './types';

export default registerAs('services', (): ServicesConfig => {
  const { ENV, CDN_URL } = process.env;

  const isLocal = ENV === 'local';
  const mockSvcUrl = 'http://mockserver:1080';

  let config: ServicesConfig;

  if (isLocal) {
    config = {
      users: `${mockSvcUrl}/users`,
      cdn: CDN_URL,
      channels: `${mockSvcUrl}/channels`,
      invites: `${mockSvcUrl}/invites`,
    };
  } else {
    config = {
      users: 'http://users:4000',
      channels: 'http://channels:4000',
      cdn: CDN_URL,
      invites: 'http://invites:4000',
    };
  }

  return config;
});
