import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Client } from '@aws-sdk/client-s3';

import { InvitesModule } from 'src/invites/invites.module';
import { UsersModule } from 'src/users/users.module';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { ManagementService } from './management/management.service';
import { ManagementController } from './management/management.controller';
import { ConfigService } from '@nestjs/config';
import { IAWSConfig } from 'src/config/types';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';
import { MembersController } from './members/members.controller';
import { MembersService } from './members/members.service';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    forwardRef(() => InvitesModule),
    UsersModule,
    ChannelsModule,
  ],
  controllers: [
    ServersController,
    ManagementController,
    RolesController,
    MembersController,
  ],
  providers: [
    ServersService,
    ManagementService,
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { accessKeyId, secret } = configService.get<IAWSConfig>('aws');

        return new S3Client({
          region: 'eu-central-1',
          credentials: {
            accessKeyId,
            secretAccessKey: secret,
          },
        });
      },
    },
    RolesService,
    MembersService,
  ],
  exports: [ServersService],
})
export class ServersModule {}
