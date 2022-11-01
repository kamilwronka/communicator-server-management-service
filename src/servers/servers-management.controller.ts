import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserId } from 'src/decorators/userId.decorator';
import {
  UploadServerImageDto,
  UploadServerImageParamsDto,
} from './dto/uploadServerImage.dto';
import { ServersManagementService } from './servers-management.service';
import { TUploadServerImageResponse } from './types';

@Controller('')
export class ServersManagementController {
  constructor(
    private readonly serversManagementService: ServersManagementService,
  ) {}

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
