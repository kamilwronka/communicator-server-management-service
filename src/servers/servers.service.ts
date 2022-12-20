import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateServerDto } from './dto/create-server.dto';
import { ServersRoutingKey } from './enums/servers-routing-key.enum';
import { MembersService } from './members/members.service';
import { INITIAL_ROLES } from './roles/constants/initial-roles.constant';
import { RolesService } from './roles/roles.service';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly rolesService: RolesService,
    private readonly membersService: MembersService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async findServerById(serverId: string): Promise<ServerDocument> {
    const server = await this.serverModel.findById(serverId).populate('roles');

    if (!server) {
      throw new NotFoundException();
    }

    return server;
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
    };

    const server = await new this.serverModel(serverData).save();

    const promiseArray = INITIAL_ROLES.map((role) =>
      this.rolesService
        .createRole(userId, server._id, role)
        .then((roleData) => roleData._id),
    );

    const roles = await Promise.all(promiseArray);

    await this.membersService.createMember(userId, server._id, roles);

    this.publishServerEvent(ServersRoutingKey.SERVER_CREATE, server);

    return server;
  }

  publishServerEvent(key: ServersRoutingKey, data: ServerDocument) {
    const member = data.toJSON();

    this.amqpConnection.publish('default', key, member);
  }
}
