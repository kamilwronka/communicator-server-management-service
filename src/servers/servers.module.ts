import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvitesModule } from 'src/invites/invites.module';
import { UsersModule } from 'src/users/users.module';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { ChannelsModule } from 'src/channels/channels.module';
import { RolesModule } from 'src/roles/roles.module';
import { MembersModule } from 'src/members/members.module';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    forwardRef(() => InvitesModule),
    forwardRef(() => RolesModule),
    forwardRef(() => MembersModule),
    UsersModule,
    ChannelsModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<RabbitMQConfig>('rabbitmq');

        return config;
      },
    }),
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
