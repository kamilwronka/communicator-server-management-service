import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { ICloudflareConfig } from 'src/config/types';
import { generateFileUploadData } from 'src/helpers/generateFileUploadData.helper';
import { UploadServerImageDto } from './dto/upload-server-image.dto';
import { ServersService } from '../servers.service';
import { TUploadServerImageResponse } from './types';
import { UpdateServerSettingsDto } from './dto/update-server-settings.dto';
import { Server, ServerDocument } from '../schemas/server.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ManagementService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly serversService: ServersService,
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
    private readonly channelsService: ChannelsService,
  ) {}

  async updateServerSettings(
    userId: string,
    serverId: string,
    updateServerData: UpdateServerSettingsDto,
  ): Promise<Server> {
    const server = await this.serversService.getServer(userId, serverId);

    // @TODO - here will come roles-checking etc
    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const changedValues = Object.keys(updateServerData);

    changedValues.forEach((value) => {
      server[value] = updateServerData[value];
    });

    const updatedServer = await server.save();

    return new Server(updatedServer.toJSON());
  }

  async uploadServerImage(
    userId: string,
    serverId: string,
    uploadServerImageData: UploadServerImageDto,
  ): Promise<TUploadServerImageResponse> {
    const server = await this.serversService.getServer(userId, serverId);

    // @TODO - here will come roles-checking etc
    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const { bucketName } =
      this.configService.get<ICloudflareConfig>('cloudflare');

    const { key, mimeType } = generateFileUploadData(
      `servers/${serverId}`,
      uploadServerImageData.filename,
    );

    if (!mimeType) {
      throw new BadRequestException('wrong file extension');
    }

    const presignedUrl = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: mimeType,
      }),
    );

    return { key, uploadUrl: presignedUrl };
  }

  async createChannel(
    userId: string,
    serverId: string,
    createChannelData: CreateChannelDto,
  ) {
    const server = await this.serversService.getServer(userId, serverId);

    // @TODO - here will come roles-checking etc
    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const response = await this.channelsService.createServerChannel(
      serverId,
      createChannelData,
    );

    return response;
  }
}
