import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
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
import { RoutingKeys } from '../enums/routing-keys.enum';

import { CreateMemberDto } from './dto/create-member.dto';
import { GetMembersParamsDto } from './dto/members-params.dto';
import { Member, MemberDocument } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
    @Inject(forwardRef(() => ServersService))
    private readonly serversService: ServersService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getMembers(userId: string, { serverId }: GetMembersParamsDto) {
    const members = await this.memberModel.find({ serverId });

    return members;
  }

  async createMember(
    userId: string,
    serverId: string,
    data?: CreateMemberDto,
    disableChecks = false,
  ) {
    // check if invite is valid
    if (!disableChecks) {
      await this.inviteService.getInviteById(data?.inviteId);
    }

    const server = await this.serversService.findServerById(serverId);

    // check if exists
    const exists = server.members.find((member) => member === userId);

    if (exists) {
      throw new UnprocessableEntityException('exists');
    }

    const memberData: Partial<Member> = {
      userId,
      roles: data.roles,
      serverId,
    };

    const member = await new this.memberModel(memberData).save();

    server.members.push(member.userId);
    await server.save();

    this.amqpConnection.publish('default', RoutingKeys.MEMBER_CREATE, {
      userId,
      serverId,
      roles: data.roles,
    });

    return member;
  }
}
