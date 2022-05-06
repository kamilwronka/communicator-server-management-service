import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvitesModule } from 'src/invites/invites.module';
import { Server, ServerSchema } from './schemas/server.schema';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    forwardRef(() => InvitesModule),
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
