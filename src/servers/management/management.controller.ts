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

  @Post(':serverId/upload-image')
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
}
