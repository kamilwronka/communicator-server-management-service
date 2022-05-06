import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServersModule } from 'src/servers/servers.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { Invite, ServerInviteSchema } from './schemas/invite.schema';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService],
  imports: [
    forwardRef(() => ServersModule),
    MongooseModule.forFeature([
      { name: Invite.name, schema: ServerInviteSchema },
    ]),
  ],
  exports: [InvitesService],
})
export class InvitesModule {}
