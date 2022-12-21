import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInviteDto } from './dto/create-invite.dto';
import { validateInvite } from './helpers/validate-invite.helper';
import { Invite, InviteDocument } from './schemas/invite.schema';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Invite.name)
    private inviteModel: Model<InviteDocument>,
  ) {}

  async getInvite(id: string) {
    const invite = await this.inviteModel
      .findById(id)
      .populate(['inviter', 'server']);
    const isValid = validateInvite(invite);

    if (!isValid) {
      throw new NotFoundException();
    }

    return invite;
  }

  async createInvite(userId: string, serverId: string, data: CreateInviteDto) {
    const { maxAge, maxUses, validate } = data;

    if (validate) {
      let existingInvite;
      let isValid;

      try {
        existingInvite = await this.getInvite(validate);
        isValid = validateInvite(existingInvite);
      } catch (error) {
        isValid = false;
      }

      if (isValid) {
        return existingInvite;
      }

      await this.deleteInvite(validate);
    }

    const inviteData: Partial<Invite> = {
      maxAge,
      maxUses,
      inviterId: userId,
      serverId,
    };

    const invite = new this.inviteModel(inviteData);
    const databaseResponse = await invite.save();
    const populated = await databaseResponse.populate(['inviter', 'server']);

    return populated;
  }

  async deleteInvite(id: string) {
    return this.inviteModel.findByIdAndDelete(id);
  }

  async getInvitesByServerId(id: string) {
    const invites = await this.inviteModel
      .find({
        serverId: id,
      })
      .populate(['inviter', 'server']);

    return invites;
  }
}
