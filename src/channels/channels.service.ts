import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessToken } from 'livekit-server-sdk';
import { ServersService } from 'src/servers/servers.service';

import { CreateChannelDto, User } from './dto/create-channel.dto';
import { ChannelType } from './enums/channelTypes.enum';
import { PermissionType } from './enums/permission-type.enum';
import { Channel, ChannelDocument } from './schemas/channel.schema';
import { getUserData } from 'src/services/users/users.service';
import { configService } from 'src/config/config.service';
import { UpdateLastMessageDateDto } from './dto/update-last-message-date.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    @Inject(forwardRef(() => ServersService))
    private serversService: ServersService,
  ) {}

  async getPrivateChannels(userId: string) {
    const channels = await this.channelModel
      .find({
        'users.user_id': userId,
      })
      .sort({ last_message_date: -1 });

    return channels;
  }

  async getServerChannels(serverId: string) {
    const channels = await this.channelModel.find({ server_id: serverId });

    return channels;
  }

  async getMatchingChannels(users: User[]) {
    const channels = await this.channelModel.find({ users });

    return channels;
  }

  async createChannel(
    createChannelData: CreateChannelDto,
    userId?: string,
    serverId?: string,
  ) {
    const { name, type, permissions_overwrites, parent_id, users } =
      createChannelData;

    let channel: Channel = {} as Channel;

    if (users && serverId) {
      throw new UnprocessableEntityException();
    }

    if (users && users.length > 1) {
      if (type !== ChannelType.PRIVATE) {
        throw new BadRequestException('Wrong channel type');
      }

      if (users[0].user_id === users[1].user_id) {
        throw new BadRequestException(
          'Cannot create channel for the same person',
        );
      }

      const matchingChannels = await this.getMatchingChannels(users);

      if (matchingChannels && matchingChannels.length > 0) {
        throw new BadRequestException(
          'Channel between these users already created',
        );
      }

      channel = {
        name,
        type,
        server_id: null,
        users,
        last_message_date: new Date().toISOString(),
      };
    }

    if (serverId && type !== ChannelType.PRIVATE) {
      const server = await this.serversService.getServerById(serverId);

      const canCreate = server.owner_id === userId;

      if (!canCreate) {
        throw new ForbiddenException();
      }

      if (parent_id) {
        const parent = await this.getChannelById(parent_id);

        if (!parent) {
          throw new BadRequestException('Invalid parent id');
        }
      }

      if (permissions_overwrites && permissions_overwrites.length > 0) {
        permissions_overwrites.forEach((permission) => {
          if (permission.type === PermissionType.ROLE) {
            const match = server.roles.find((role) => {
              return role._id.toString() === permission.id;
            });

            if (!match) {
              throw new BadRequestException('No such role on the server');
            }
          }

          if (permission.type === PermissionType.USER) {
            const match = server.members.find((member) => {
              return member.user_id.toString() === permission.id;
            });

            if (!match) {
              throw new BadRequestException('No such member on the server');
            }
          }
        });
      }

      channel = {
        name,
        type,
        permissions_overwrites,
        server_id: serverId,
        parent_id,
      };
    }

    const newChannel = new this.channelModel(channel);

    let dbResponse;

    try {
      dbResponse = await newChannel.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return dbResponse;
  }

  async getChannelById(channelId: string) {
    let channel;

    try {
      channel = await this.channelModel.findById(channelId);

      if (!channel) {
        throw new NotFoundException();
      }
    } catch (error) {
      throw error;
    }

    return channel.toJSON();
  }

  async getRTCToken(userId: string, serverId: string, channelId: string) {
    const user = await getUserData(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const { livekitApiKey, livekitApiSecret } =
      configService.getLivekitConfig();
    const roomName = channelId;
    const participantName = user.username;

    const accessToken = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: participantName,
    });
    accessToken.addGrant({ roomJoin: true, room: roomName });

    return accessToken.toJwt();
  }

  async updateLastMessageDate(
    channelId: string,
    data: UpdateLastMessageDateDto,
  ) {
    const response = await this.channelModel.updateOne(
      {
        _id: channelId,
        last_message_date: { $lt: data.date },
      },
      {
        $set: { last_message_date: data.date },
      },
      { new: true },
    );

    return response;
  }
}
