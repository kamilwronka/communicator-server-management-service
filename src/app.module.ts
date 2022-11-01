import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import cloudflareConfig from './config/cloudflare.config';
import servicesConfig from './config/services.config';
import mongoConfig from './config/mongo.config';
import livekitConfig from './config/livekit.config';
import appConfig from './config/app.config';
import { EEnvironment, IMongoConfig } from './config/types';

import { ServersModule } from './servers/servers.module';
import { InvitesModule } from './invites/invites.module';
import { HealthController } from './health/health.controller';

import { ChannelsModule } from './channels/channels.module';
import { MembersModule } from './members/members.module';
import { UsersModule } from './users/users.module';

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
    ChannelsModule,
    MembersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        livekitConfig,
        mongoConfig,
        servicesConfig,
        cloudflareConfig,
      ],
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
        CLOUDFLARE_ACCOUNT_ID: Joi.string(),
        CLOUDFLARE_ACCESS_KEY_ID: Joi.string(),
        CLOUDFLARE_SECRET_ACCESS_KEY: Joi.string(),
        CLOUDFLARE_R2_BUCKET_NAME: Joi.string(),
        LIVEKIT_API_KEY: Joi.string(),
        LIVEKIT_API_SECRET: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
