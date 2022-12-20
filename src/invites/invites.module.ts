import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServicesConfig } from 'src/common/config/types';

import { ServersModule } from 'src/servers/servers.module';
import { UsersModule } from 'src/users/users.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService],
  imports: [
    forwardRef(() => ServersModule),
    UsersModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { invites } = configService.get<ServicesConfig>('services');

        return {
          baseURL: invites,
          maxRedirects: 5,
          timeout: 5000,
        };
      },
    }),
  ],
  exports: [InvitesService],
})
export class InvitesModule {}
