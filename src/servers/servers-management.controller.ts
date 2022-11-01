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
import { UpdateServerSettingsDto } from './dto/updateServerSettings.dto';
import {
  UploadServerImageDto,
  UploadServerImageParamsDto,
} from './dto/uploadServerImage.dto';
import { Server } from './schemas/server.schema';
import { ServersManagementService } from './servers-management.service';
import { TUploadServerImageResponse } from './types';

@Controller('')
export class ServersManagementController {
  constructor(
    private readonly serversManagementService: ServersManagementService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':serverId')
  async updateServerSettings(
    @UserId() userId: string,
    @Param() params: UploadServerImageParamsDto,
    @Body() updateServerSettingData: UpdateServerSettingsDto,
  ): Promise<Server> {
    return this.serversManagementService.updateServerSettings(
      userId,
      params.serverId,
      updateServerSettingData,
    );
  }

  @Post(':serverId/upload-image')
  async uploadServerImage(
    @UserId() userId: string,
    @Param() params: UploadServerImageParamsDto,
    @Body() uploadServerImageData: UploadServerImageDto,
  ): Promise<TUploadServerImageResponse> {
    return this.serversManagementService.uploadServerImage(
      userId,
      params.serverId,
      uploadServerImageData,
    );
  }
}
