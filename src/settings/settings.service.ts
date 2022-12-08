import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSConfig } from 'src/config/types';
import { generateFileUploadData } from 'src/helpers/generateFileUploadData.helper';
import { Server } from 'src/servers/schemas/server.schema';
import { ServersService } from 'src/servers/servers.service';
import { RoutingKeys } from '../enums/routing-keys.enum';
import { UpdateServerSettingsDto } from './dto/update-server-settings.dto';
import { UploadServerImageDto } from './dto/upload-server-image.dto';
import { UploadServerImageResponse } from './types';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
    private readonly serversService: ServersService,
    private readonly amqpService: AmqpConnection,
  ) {}

  async update(
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

    this.amqpService.publish(
      'default',
      RoutingKeys.SERVER_UPDATE,
      updatedServer,
    );

    return updatedServer;
  }

  async uploadServerImage(
    userId: string,
    serverId: string,
    uploadServerImageData: UploadServerImageDto,
  ): Promise<UploadServerImageResponse> {
    const server = await this.serversService.getServer(userId, serverId);

    // @TODO - here will come roles-checking etc
    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const { bucketName } = this.configService.get<AWSConfig>('aws');

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
}
