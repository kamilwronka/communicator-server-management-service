import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { ServersModule } from './servers/servers.module';
import { InvitesModule } from './invites/invites.module';
import { HealthController } from './health/health.controller';

import { CONFIG_MODULE_CONFIG } from './common/config/config-module.config';

@Module({
  imports: [
    InvitesModule,
    ServersModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<MongooseModuleOptions>('mongodb'),
    }),
    TerminusModule,
    ConfigModule.forRoot(CONFIG_MODULE_CONFIG),
  ],
  controllers: [HealthController],
})
export class AppModule {}
