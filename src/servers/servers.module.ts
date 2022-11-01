import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Client } from '@aws-sdk/client-s3';

import { InvitesModule } from 'src/invites/invites.module';
import { UsersModule } from 'src/users/users.module';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { ServersManagementService } from './servers-management.service';
import { ServersManagementController } from './servers-management.controller';
import { ConfigService } from '@nestjs/config';
import { ICloudflareConfig } from 'src/config/types';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    forwardRef(() => InvitesModule),
    UsersModule,
  ],
  controllers: [
    ServersController,
    ServersManagementController,
    RolesController,
  ],
  providers: [
    ServersService,
    ServersManagementService,
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { accountId, apiKey, secret } =
          configService.get<ICloudflareConfig>('cloudflare');

        return new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: apiKey,
            secretAccessKey: secret,
          },
        });
      },
    },
    RolesService,
  ],
  exports: [ServersService],
})
export class ServersModule {}
