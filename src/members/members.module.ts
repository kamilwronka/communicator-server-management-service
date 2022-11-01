import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitesModule } from 'src/invites/invites.module';
import { Server, ServerSchema } from 'src/servers/schemas/server.schema';
import { UsersModule } from 'src/users/users.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
    forwardRef(() => InvitesModule),
    UsersModule,
  ],
})
export class MembersModule {}
