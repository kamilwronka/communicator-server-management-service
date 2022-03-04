import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { ServersModule } from './servers/servers.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    ServersModule,
    MongooseModule.forRoot(
      configService.getMongoConnectionUri().connectionUri,
      {
        dbName: configService.getMongoConnectionUri().database,
        ssl: false,
      },
    ),
    UsersModule,
    InvitesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
