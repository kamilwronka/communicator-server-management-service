import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitesService } from 'src/invites/invites.service';

import { Member } from 'src/servers/schemas/member.schema';
import { Server, ServerDocument } from 'src/servers/schemas/server.schema';
import { UsersService } from 'src/users/users.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
    private readonly usersService: UsersService,
  ) {}

  async createMember(
    userId: string,
    serverId: string,
    { inviteId }: CreateMemberDto,
  ) {
    // check if invite is valid
    await this.inviteService.getInvite(inviteId);
    const user = await this.usersService.getUserById(userId);

    const server = await this.serverModel.findById(serverId);
    const exists = server?.members.find((member) => member.id === userId);

    if (exists) {
      throw new BadRequestException('User already joined this server.');
    }

    const member: Member = {
      id: user.id,
      username: user.username,
      profile_picture_url: user.profile_picture_url,
      roles: [],
    };

    await this.serverModel.findByIdAndUpdate(serverId, {
      $push: { members: member },
    });

    return server;
  }
}
