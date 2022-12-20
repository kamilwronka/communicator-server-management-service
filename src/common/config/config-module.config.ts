import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import { RuntimeEnvironment } from '../types/common';

import appConfig from './app.config';
import awsConfig from './aws.config';
import mongoConfig from './mongo.config';
import rabbitmqConfig from './rabbitmq.config';
import servicesConfig from './services.config';

export const CONFIG_MODULE_CONFIG: ConfigModuleOptions = {
  isGlobal: true,
  load: [appConfig, mongoConfig, servicesConfig, awsConfig, rabbitmqConfig],
  cache: true,
  validationSchema: Joi.object({
    ENV: Joi.string()
      .valid(
        RuntimeEnvironment.LOCAL,
        RuntimeEnvironment.DEV,
        RuntimeEnvironment.PROD,
      )
      .default(RuntimeEnvironment.LOCAL),
    PORT: Joi.number(),

    MONGODB_PASSWORD: Joi.string(),
    MONGODB_USER: Joi.string(),
    MONGODB_HOST: Joi.string(),
    MONGODB_ACCESS_PORT: Joi.string(),
    MONGODB_DATABASE: Joi.string(),

    RABBITMQ_USER: Joi.string(),
    RABBITMQ_PASSWORD: Joi.string(),
    RABBITMQ_HOST: Joi.string(),
    RABBITMQ_ACCESS_PORT: Joi.string(),

    AWS_ACCESS_KEY_ID: Joi.string(),
    AWS_SECRET_ACCESS_KEY: Joi.string(),
    AWS_S3_BUCKET_NAME: Joi.string(),
  }),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
};
