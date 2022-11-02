import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserId } from 'src/decorators/userId.decorator';
import { UpdateServerSettingsDto } from './dto/update-server-settings.dto';
import {
  UploadServerImageDto,
  UploadServerImageParamsDto,
} from './dto/upload-server-image.dto';
import { Server } from '../schemas/server.schema';
import { ManagementService } from './management.service';
import { TUploadServerImageResponse } from './types';
import {
  CreateChannelDto,
  CreateChannelParamsDto,
} from './dto/create-channel.dto';
import { TChannel } from 'src/channels/types';

@Controller('')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':serverId')
  async updateServerSettings(
    @UserId() userId: string,
    @Param() params: UploadServerImageParamsDto,
    @Body() updateServerSettingData: UpdateServerSettingsDto,
  ): Promise<Server> {
    return this.managementService.updateServerSettings(
      userId,
      params.serverId,
      updateServerSettingData,
    );
  }

  @Post(':serverId/images')
  async uploadServerImage(
    @UserId() userId: string,
    @Param() params: UploadServerImageParamsDto,
    @Body() uploadServerImageData: UploadServerImageDto,
  ): Promise<TUploadServerImageResponse> {
    return this.managementService.uploadServerImage(
      userId,
      params.serverId,
      uploadServerImageData,
    );
  }

  @Post(':serverId/channels')
  async createChannel(
    @UserId() userId: string,
    @Param() params: CreateChannelParamsDto,
    @Body() uploadServerImageData: CreateChannelDto,
  ): Promise<TChannel> {
    return this.managementService.createChannel(
      userId,
      params.serverId,
      uploadServerImageData,
    );
  }
}
