import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import awsConfig from './config/aws.config';
import servicesConfig from './config/services.config';
import mongoConfig from './config/mongo.config';
import livekitConfig from './config/livekit.config';
import appConfig from './config/app.config';
import { EEnvironment, IMongoConfig } from './config/types';

import { ServersModule } from './servers/servers.module';
import { InvitesModule } from './invites/invites.module';
import { HealthController } from './health/health.controller';

import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ServersModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, password, user, database } =
          configService.get<IMongoConfig>('mongodb');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}`,
          ssl: false,
          dbName: database,
        };
      },
    }),
    InvitesModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, livekitConfig, mongoConfig, servicesConfig, awsConfig],
      cache: true,
      validationSchema: Joi.object({
        ENV: Joi.string()
          .valid(EEnvironment.LOCAL, EEnvironment.DEV, EEnvironment.PROD)
          .default(EEnvironment.LOCAL),
        PORT: Joi.number(),
        CDN_URL: Joi.string(),
        MONGODB_PASSWORD: Joi.string(),
        MONGODB_USER: Joi.string(),
        MONGODB_HOST: Joi.string(),
        MONGODB_PORT: Joi.string(),
        MONGODB_DATABASE: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_S3_BUCKET_NAME: Joi.string(),
        LIVEKIT_API_KEY: Joi.string(),
        LIVEKIT_API_SECRET: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    UsersModule,
    ChannelsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
