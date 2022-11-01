import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ServersService } from 'src/servers/servers.service';
import { UsersService } from 'src/users/users.service';
import { CreateInviteDto } from './dto/createInvite.dto';
import { checkIfValid } from './helpers/checkIfValid';
import { Invite, InviteDocument } from './schemas/invite.schema';

@Injectable()
export class InvitesService {
  constructor(
    @Inject(forwardRef(() => ServersService))
    private serversService: ServersService,
    @InjectModel(Invite.name)
    private inviteModel: Model<InviteDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createInvite(userId: string, serverId: string, body: CreateInviteDto) {
    const { max_age, max_uses, validate } = body;
    const server = await this.serversService.getServer(userId, serverId);

    if (validate) {
      let existingInvite;
      let isValid;

      try {
        existingInvite = await this.getInvite(validate);
        isValid = this.validateInvite(existingInvite);
      } catch (error) {
        isValid = false;
      }

      if (isValid) {
        return existingInvite;
      }
    }

    const user = await this.usersService.getUserById(userId);
    const { user_id, profile_picture_url, username } = user;

    const invitationData: Invite = {
      max_age,
      max_uses,
      inviter: {
        user_id,
        profile_picture_url,
        username,
      },
      server: {
        id: server._id,
        name: server.name,
        icon: server.icon,
      },
    };

    const invitation = new this.inviteModel(invitationData).save();

    return invitation;
  }

  async getInvite(inviteId: string) {
    const invite = await this.inviteModel.findById(inviteId);
    const isValid = this.validateInvite(invite);

    if (!isValid) {
      throw new NotFoundException('Invite not found.');
    }

    return invite;
  }

  async deleteInvite(userId: string, inviteId: string) {
    const invite = await this.getInvite(inviteId);

    if (invite.inviter.user_id !== userId) {
      throw new ForbiddenException();
    }

    await this.inviteModel.findByIdAndDelete(inviteId);

    return invite;
  }

  async getServerInvites(userId: string, serverId: string) {
    // TODO - add role checking

    const server = await this.serversService.getServer(userId, serverId);

    const invites = await this.inviteModel.find({
      'server.id': server._id.toString(),
    });

    return invites;
  }

  validateInvite(invite: Invite) {
    return checkIfValid(invite);
  }
}
