import { UsersService } from '@communicator/common';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InvitesService } from 'src/invites/invites.service';
import { CreateServerDto } from './dto/createServer.dto';
import { ChannelType } from './enums/channelTypes.enum';
import { EventLogDestination } from './enums/eventLogDestination.enum';
import { EventLogType } from './enums/eventLogType.enum';
import { Permissions } from './enums/permissions.enum';
import { Channel } from './schemas/channel.schema';
import { Member } from './schemas/member.schema';
import { Role } from './schemas/role.schema';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private usersService: UsersService,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
  ) {}

  async createServer(userId: string, server: CreateServerDto) {
    // get user data
    const response = await this.usersService.getUserData(userId);

    // create new server
    const ownerRoleId = new Types.ObjectId();
    const defaultRoles: Role[] = [
      {
        name: 'owner',
        permissions: [Permissions.SHOW_CHANNELS, Permissions.MANAGE_CHANNELS],
        color: 'red',
        importance: 1,
        _id: ownerRoleId,
      },
    ];
    const defaultChannels: Channel[] = [
      {
        name: 'default text channel',
        type: ChannelType.TEXT,
        allowed_roles: [],
      },
      {
        name: 'default voice channel',
        type: ChannelType.VOICE,
        allowed_roles: [],
      },
    ];

    const serverData: Partial<Server> = {
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
          roles: [ownerRoleId],
        },
      ],
      channels: defaultChannels,
      roles: defaultRoles,
    };

    const newServerInstance = new this.serverModel(serverData);

    return newServerInstance.save();

    // wysylac message przez rabbita o utworzonym serwerze - dodanie do listy uzytkownikow serwera
    // i wyslanie info do serwisu z elastic searchem
  }

  async findUserServers(userId: string): Promise<Server[]> {
    const servers = await this.serverModel.find({
      members: { $elemMatch: { user_id: userId } },
    });

    console.log(servers);

    return servers;
  }

  async getServerDetails(userId: string, serverId: string): Promise<Server> {
    const server = await (await this.serverModel.findById(serverId)).toJSON();

    const member = server.members.find((member) => {
      return member.user_id === userId;
    });

    const canViewServer = server.owner_id === userId || member;

    // check if user can view server
    if (!canViewServer) {
      throw new ForbiddenException();
    }

    // filter channels that user has no acces to
    const userRoles = member.roles;
    const allowedChannels = server.channels.filter((channel) => {
      const allowedRoles = channel.allowed_roles;

      if (allowedRoles.length === 0) {
        return true;
      }

      const canViewChannel = allowedRoles.find((role) => {
        return userRoles
          .map((userRole) => userRole.toString())
          .includes(role.toString());
      });

      return canViewChannel;
    });

    // xd

    const filteredData = {
      ...server,
      channels: allowedChannels,
    };

    return new Server(filteredData);
  }

  async joinServer(userId: string, serverId: string, inviteId: string) {
    // check if invite is valid
    await this.inviteService.getInvite(inviteId);
    const user = await this.usersService.getUserData(userId);

    const server = await this.serverModel.findById(serverId);
    const exists = server?.members.find((member) => member.user_id === userId);

    if (exists) {
      throw new BadRequestException('User already joined this server.');
    }

    const member: Member = {
      user_id: user.user_id,
      username: user.username,
      profile_picture_url: user.profile_picture_url,
      roles: [],
    };

    await this.serverModel.findByIdAndUpdate(serverId, {
      $push: { members: member },
    });

    return server;
  }
}
