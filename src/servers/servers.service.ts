import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembersService } from 'src/members/members.service';
import { RolesService } from 'src/roles/roles.service';

import { UsersService } from 'src/users/users.service';
import { CreateServerDto } from './dto/create-server.dto';
import { EventDestination } from './enums/event-destination.enum';
import { EventType } from './enums/event-type.enum';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly membersService: MembersService,
  ) {}

  async findServerById(serverId: string): Promise<ServerDocument> {
    const server = await this.serverModel
      .findById(serverId)
      .populate(['roles', 'members']);

    if (!server) {
      throw new NotFoundException();
    }

    return server;
  }

  async findServersByUserId(userId: string): Promise<Server[]> {
    // possibly not optimal, to optimize later

    const servers = await this.serverModel.find().populate({
      path: 'members',
      match: { userId },
      transform: () => undefined,
    });

    return servers;
  }

  async getServer(userId: string, serverId: string): Promise<ServerDocument> {
    const server = await this.findServerById(serverId);

    // add user population later

    return server;
  }

  async createServer(userId: string, data: CreateServerDto) {
    // get user data
    const user = await this.usersService.getUserById(userId);

    const serverData: Partial<Server> = {
      owner_id: userId,
      name: data.name,
      icon: null,
      events: [
        {
          destination: EventDestination.SERVER,
          id: userId,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          type: EventType.CREATION,
        },
      ],
    };

    const server = await new this.serverModel(serverData).save();

    const defaultRoleData = {
      name: 'default',
      color: null,
    };

    await this.rolesService.createRole(userId, server._id, defaultRoleData);
    await this.membersService.createMember(userId, server._id, undefined, true);

    return server;
  }
}
