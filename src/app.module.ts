import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import awsConfig from './config/aws.config';
import servicesConfig from './config/services.config';
import mongoConfig from './config/mongo.config';
import appConfig from './config/app.config';
import { MongoConfig } from './config/types';

import { ServersModule } from './servers/servers.module';
import { InvitesModule } from './invites/invites.module';
import { HealthController } from './health/health.controller';

import { ChannelsModule } from './channels/channels.module';
import { RuntimeEnvironment } from './types/common';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    InvitesModule,
    ServersModule,
    ChannelsModule,
    SettingsModule,
    RolesModule,
    MembersModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, password, user, database } =
          configService.get<MongoConfig>('mongodb');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}`,
          ssl: false,
          dbName: database,
        };
      },
    }),
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig, servicesConfig, awsConfig],
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
        CDN_URL: Joi.string(),
        MONGODB_PASSWORD: Joi.string(),
        MONGODB_USER: Joi.string(),
        MONGODB_HOST: Joi.string(),
        MONGODB_PORT: Joi.string(),
        MONGODB_DATABASE: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_S3_BUCKET_NAME: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
