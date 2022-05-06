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
import { getUserData } from 'src/services/users/users.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
  ) {}

  async addMember(userId: string, serverId: string, inviteId: string) {
    // check if invite is valid
    await this.inviteService.getInvite(inviteId);
    const user = await getUserData(userId);

    const server = await this.serverModel.findById(serverId);
    const exists = server?.members.find((member) => member.user_id === userId);

    if (exists) {
      throw new BadRequestException('User already joined this server.');
    }

    const member: Member = {
      user_id: user.user_id,
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
