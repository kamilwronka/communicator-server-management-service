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
import { UploadServerImageDto } from './dto/uploadServerImage.dto';
import { ServersService } from './servers.service';
import { TUploadServerImageResponse } from './types';

@Injectable()
export class ServersManagementService {
  constructor(
    private readonly serversService: ServersService,
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {}

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
}
