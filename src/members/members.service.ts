import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitesService } from 'src/invites/invites.service';
import { ServersService } from 'src/servers/servers.service';

import { CreateMemberDto } from './dto/create-member.dto';
import { Member, MemberDocument } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
    @Inject(forwardRef(() => ServersService))
    private readonly serversService: ServersService,
  ) {}

  async createMember(
    userId: string,
    serverId: string,
    data?: CreateMemberDto,
    disableInviteCheck = false,
  ) {
    // check if invite is valid
    if (!disableInviteCheck) {
      await this.inviteService.getInviteById(data?.inviteId);
    }

    const server = await this.serversService.findServerById(serverId);

    // check if exists
    const exists = server.members.find((member) => member.userId === userId);

    if (exists) {
      throw new UnprocessableEntityException('exists');
    }

    const memberData: Partial<Member> = {
      userId,
      roles: [],
    };

    const member = await new this.memberModel(memberData).save();

    // update server members
    server.members.push(member._id);
    await server.save();

    return member;
  }
}
