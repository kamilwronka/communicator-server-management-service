import { forwardRef, Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schemas/member.schema';
import { UsersModule } from 'src/users/users.module';
import { ServersModule } from 'src/servers/servers.module';
import { InvitesModule } from 'src/invites/invites.module';

@Module({
  providers: [MembersService],
  controllers: [MembersController],
  exports: [MembersService],
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    UsersModule,
    forwardRef(() => ServersModule),
    forwardRef(() => InvitesModule),
  ],
})
export class MembersModule {}
