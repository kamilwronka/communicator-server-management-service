import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateServerDto } from './dto/createServer.dto';
import { ChannelType } from './enums/channelTypes.enum';
import { EventLogDestination } from './enums/eventLogDestination.enum';
import { EventLogType } from './enums/eventLogType.enum';

import { Server } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<Server>,
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
          roles: [],
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

    // return newServerInstance.save();

    // wysylac message przez rabbita o utworzonym serwerze - dodanie do listy uzytkownikow serwera
    // i wyslanie info do serwisu z elastic searchem

    return newServerInstance;
  }

  async findUserServers(userId: string) {
    const servers = await this.serverModel.find({ owner_id: userId });

    return servers;
  }
}
