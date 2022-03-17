import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config/config.service';
import { ServersModule } from './servers/servers.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ServersModule,
    MongooseModule.forRootAsync({
      useFactory: () => {
        const config = configService.getMongoConnectionConfig();

        return {
          uri: config.connectionUri,
          ssl: true,
          dbName: config.database,
        };
      },
    }),
    UsersModule,
    InvitesModule,
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
