import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { Server } from 'src/servers/schemas/server.schema';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import { UpdateServerSettingsDto } from './dto/update-server-settings.dto';
import {
  UploadServerImageDto,
  UploadServerImageParamsDto,
} from './dto/upload-server-image.dto';
import { SettingsService } from './settings.service';
import { UploadServerImageResponse } from './types';

@ApiTags('settings')
@UseGuards(AuthGuard)
@Controller('')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseInterceptors(CustomSerializerInterceptor(Server))
  @Patch(':serverId')
  async updateServerSettings(
    @UserId() userId: string,
    @Param() params: UploadServerImageParamsDto,
    @Body() updateServerSettingData: UpdateServerSettingsDto,
  ): Promise<Server> {
    return this.settingsService.update(
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
  ): Promise<UploadServerImageResponse> {
    return this.settingsService.uploadServerImage(
      userId,
      params.serverId,
      uploadServerImageData,
    );
  }
}
