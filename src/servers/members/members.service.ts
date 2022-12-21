import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesService } from '../roles/roles.service';
import { Server, ServerDocument } from '../schemas/server.schema';

import { CreateMemberDto } from './dto/create-member.dto';
import { DeleteMemberParamsDto } from './dto/delete-member.dto';
import { GetMembersParamsDto } from './dto/members-params.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersRoutingKey } from './enums/members-routing-key.enum';
import { Member, MemberDocument } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberRepository: Model<MemberDocument>,
    @InjectModel(Server.name) private serverRepository: Model<ServerDocument>,
    private readonly amqpConnection: AmqpConnection,
    private readonly rolesService: RolesService,
  ) {}

  async getMembers({ serverId }: GetMembersParamsDto) {
    const members = await this.memberRepository
      .find({ serverId })
      .populate(['user', 'roles']);

    return members;
  }

  async createMember(
    userId: string,
    serverId: string,
    roleIds: string[],
  ): Promise<Member> {
    try {
      const member = await new this.memberRepository({
        userId,
        serverId,
        roleIds,
      }).save();

      const server = await this.serverRepository.findById(serverId);
      server.members = [...new Set([...server.members, member.userId])];
      await server.save();

      const populated = await member.populate(['roles', 'user']);

      this.publishMemberEvent(MembersRoutingKey.MEMBER_CREATE, populated);

      return populated;
    } catch (error) {
      throw new BadRequestException('already a member');
    }
  }

  async joinServer(userId: string, serverId: string, data: CreateMemberDto) {
    // @TODO - check if invite is valid later, probably should move invites to this service
    console.log(data.inviteId);

    const defaultRole = await this.rolesService.getDefaultServerRole(serverId);
    const member = await this.createMember(userId, serverId, [defaultRole._id]);

    return member;
  }

  async updateMember(memberId: string, data: UpdateMemberDto) {
    const member = await this.memberRepository.findById(memberId);

    // @TODO - check restricted roles

    Object.entries(data).map(([key, value]) => {
      member[key] = value;
    });

    const updatedMember = await member.save();

    this.publishMemberEvent(MembersRoutingKey.MEMBER_UPDATE, updatedMember);

    return updatedMember;
  }

  async deleteMember({ serverId, memberId }: DeleteMemberParamsDto) {
    const member = await this.memberRepository.findOneAndDelete({
      _id: memberId,
    });

    if (!member) {
      throw new NotFoundException();
    }

    const server = await this.serverRepository.findById(serverId);
    server.members = [
      ...new Set(server.members.filter((member) => member === memberId)),
    ];
    await server.save();

    return this.publishMemberEvent(MembersRoutingKey.MEMBER_DELETE, member);
  }

  publishMemberEvent(key: MembersRoutingKey, data: MemberDocument) {
    const member = data.toJSON();

    this.amqpConnection.publish('default', key, member);
  }
}
