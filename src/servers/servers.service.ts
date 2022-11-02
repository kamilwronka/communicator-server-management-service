import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChannelsService } from 'src/channels/channels.service';

import { InvitesService } from 'src/invites/invites.service';
import { UsersService } from 'src/users/users.service';
import { CreateServerDto } from './dto/create-server.dto';
import { EventDestination } from './enums/event-destination.enum';
import { EventType } from './enums/event-type.enum';
import { EPermissions } from './roles/enums/permissions.enum';
import { Role } from './roles/schemas/role.schema';

import { Server, ServerDocument } from './schemas/server.schema';

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    @Inject(forwardRef(() => InvitesService))
    private inviteService: InvitesService,
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService,
  ) {}

  async findServerById(serverId: string): Promise<ServerDocument> {
    const server = await this.serverModel.findById(serverId);

    if (!server) {
      throw new NotFoundException();
    }

    return server;
  }

  async findServersByUserId(userId: string): Promise<Server[]> {
    const servers = await this.serverModel.find({
      members: { $elemMatch: { user_id: userId } },
    });

    return servers;
  }

  async getServer(userId: string, serverId: string): Promise<ServerDocument> {
    const server = await this.findServerById(serverId);

    const member = server.members.find((member) => {
      return member.user_id === userId;
    });

    const canViewServer = server.owner_id === userId || member;

    // check if user can view server
    if (!canViewServer) {
      throw new ForbiddenException();
    }

    return server;
  }

  async createServer(userId: string, server: CreateServerDto) {
    // get user data
    const user = await this.usersService.getUserById(userId);

    // create new server
    const ownerRoleId = new Types.ObjectId();
    const defaultRoles: Role[] = [
      {
        name: 'owner',
        permissions: [EPermissions.SHOW_CHANNELS, EPermissions.MANAGE_CHANNELS],
        color: 'red',
        importance: 1,
        _id: ownerRoleId,
      },
    ];

    const serverData: Partial<Server> = {
      owner_id: userId,
      name: server.name,
      icon: null,
      events: [
        {
          destination: EventDestination.SERVER,
          user_id: userId,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          type: EventType.CREATION,
        },
      ],
      members: [
        {
          user_id: userId,
          username: user.username,
          profile_picture_url: user.profile_picture_url,
          roles: [ownerRoleId],
        },
      ],
      roles: defaultRoles,
    };

    const newServerInstance = new this.serverModel(serverData);

    return newServerInstance.save();
  }

  async getChannels(userId: string, serverId: string) {
    await this.getServer(userId, serverId);

    const response = await this.channelsService.getServerChannels(serverId);

    return response;
  }

  async getServerChannelRTCToken(
    userId: string,
    serverId: string,
    channelId: string,
  ) {
    await this.getServer(userId, serverId);

    const response = await this.channelsService.getServerChannelRTCToken(
      userId,
      channelId,
    );

    return response;
  }
}
