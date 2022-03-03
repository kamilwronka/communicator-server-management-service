import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateServerDto } from './dto/createServer.dto';
import { ChannelType } from './enums/channelTypes.enum';
import { EventLogDestination } from './enums/eventLogDestination.enum';
import { EventLogType } from './enums/eventLogType.enum';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private usersService: UsersService,
  ) {}

  async createServer(userId: string, server: CreateServerDto) {
    // pobrac dane uzytkownika, ktory tworzy serwer
    const response = await this.usersService.getUserData(userId);

    // tworzyc nowy serwer

    const serverData = {
      owner_id: userId,
      name: server.name,
      config: {
        server_image_url: server.server_image_url,
      },
      event_log: [
        {
          destination: EventLogDestination.SERVER,
          user_id: userId,
          username: response.username,
          profile_picture_url: response.profile_picture_url,
          type: EventLogType.CREATION,
        },
      ],
      members: [
        {
          user_id: userId,
          username: response.username,
          profile_picture_url: response.profile_picture_url,
          roles: ['owner', 'default'],
        },
      ],
      channels: [
        {
          name: 'default text channel',
          type: ChannelType.TEXT,
          allowed_roles: ['owner', 'default'],
        },
        {
          name: 'default voice channel',
          type: ChannelType.VOICE,
          allowed_roles: ['owner', 'default'],
        },
      ],
    };

    const newServerInstance = new this.serverModel(serverData);

    return newServerInstance.save();

    // wysylac message przez rabbita o utworzonym serwerze - dodanie do listy uzytkownikow serwera
    // i wyslanie info do serwisu z elastic searchem

    return newServerInstance;
  }

  async findUserServers(userId: string) {
    const servers = await this.serverModel.find({ owner_id: userId });

    return servers;
  }

  async getServerDetails(userId: string, serverId: string): Promise<Server> {
    const server = await (await this.serverModel.findById(serverId)).toJSON();
    const member = server.members.find((member) => member.user_id === userId);
    const canViewServer = server.owner_id === userId || member;

    // check if user can view server
    if (!canViewServer) {
      throw new ForbiddenException();
    }

    // filter channels that user has no acces to
    const userRoles = member.roles;
    const allowedChannels = server.channels.filter((channel) => {
      const allowedRoles = channel.allowed_roles;

      const canViewChannel = allowedRoles.find((role) => {
        return userRoles.includes(role);
      });

      return canViewChannel;
    });

    // xd

    console.log(server);

    const filteredData = {
      ...server,
      channels: allowedChannels,
    };

    return new Server(filteredData);
  }
}
