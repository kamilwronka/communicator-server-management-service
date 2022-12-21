import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/users/users.module';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { AWSConfig } from '../common/config/types';
import { Role, RoleSchema } from './roles/schemas/role.schema';
import { Member, MemberSchema } from './members/schemas/member.schema';
import { RolesService } from './roles/roles.service';
import { MembersService } from './members/members.service';
import { RolesController } from './roles/roles.controller';
import { MembersController } from './members/members.controller';
import { Event, EventSchema } from './events/schemas/event.schema';
import { EventsService } from './events/events.service';
import { EventsController } from './events/events.controller';
import { InvitesController } from './invites/invites.controller';
import { InvitesService } from './invites/invites.service';
import { Invite, InviteSchema } from './invites/schemas/invite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Event.name, schema: EventSchema },
      { name: Invite.name, schema: InviteSchema },
    ]),
    UsersModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<RabbitMQConfig>('rabbitmq'),
    }),
  ],
  controllers: [
    ServersController,
    RolesController,
    MembersController,
    EventsController,
    InvitesController,
  ],
  providers: [
    ServersService,
    RolesService,
    MembersService,
    EventsService,
    InvitesService,
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { s3ClientConfig } = configService.get<AWSConfig>('aws');

        return new S3Client(s3ClientConfig);
      },
    },
  ],
  exports: [ServersService],
})
export class ServersModule {}
