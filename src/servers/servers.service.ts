import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MembersService } from 'src/members/members.service';
import { RolesService } from 'src/roles/roles.service';

import { RoutingKeys } from '../enums/routing-keys.enum';
import { Permission } from '../roles/enums/permission.enum';
import { CreateServerDto } from './dto/create-server.dto';
import { EventDestination } from './enums/event-destination.enum';
import { EventType } from './enums/event-type.enum';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly rolesService: RolesService,
    private readonly membersService: MembersService,
    private readonly amqpService: AmqpConnection,
  ) {}

  async findServerById(serverId: string): Promise<ServerDocument> {
    const server = await this.serverModel.findById(serverId).populate('roles');

    if (!server) {
      throw new NotFoundException();
    }

    return server;
  }

  async findServersByUserId(userId: string): Promise<Server[]> {
    const servers = await this.serverModel.find({
      members: { $elemMatch: { $eq: userId } },
    });

    return servers;
  }

  async getServer(userId: string, serverId: string): Promise<ServerDocument> {
    const server = await this.findServerById(serverId);

    return server;
  }

  async createServer(userId: string, data: CreateServerDto) {
    // get user data

    const serverData: Partial<Server> = {
      owner_id: userId,
      name: data.name,
      icon: null,
      events: [
        {
          destination: EventDestination.SERVER,
          userId,
          type: EventType.CREATION,
        },
      ],
    };

    const server = await new this.serverModel(serverData).save();

    const defaultRoleData = {
      name: 'default',
      color: null,
      permissions: [Permission.VIEW_CHANNELS, Permission.SEND_MESSAGES],
    };

    const ownerRoleData = {
      name: 'owner',
      color: null,
      permissions: [
        Permission.SEND_MESSAGES,
        Permission.DELETE_MESSAGES,
        Permission.VIEW_MESSAGES,
        Permission.SEND_ATTACHMENTS,

        Permission.VIEW_CHANNELS,
        Permission.MANAGE_CHANNELS,
      ],
    };

    const initialRoles = [defaultRoleData, ownerRoleData];
    const promiseArray = initialRoles.map((role) =>
      this.rolesService
        .createRole(userId, server._id, role)
        .then((roleData) => roleData._id),
    );

    const roles = await Promise.all(promiseArray);

    await this.membersService.createMember(userId, server._id, { roles }, true);

    this.amqpService.publish('default', RoutingKeys.SERVER_CREATE, server);

    return server;
  }
}
