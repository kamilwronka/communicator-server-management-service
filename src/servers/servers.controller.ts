import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/userId.decorator';
import { CreateServerDto } from './dto/create-server.dto';
import { GetChannelsParamsDto } from './dto/get-channels.dto';
import { GetRTCTokenParamsDto } from './dto/get-rtc-token.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@ApiTags('servers')
@Controller('')
export class ServersController {
  constructor(private serversService: ServersService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getServers(@UserId() userId: string): Promise<Server[]> {
    return this.serversService.findServersByUserId(userId);
  }

  @Post('')
  async createServer(@UserId() userId: string, @Body() body: CreateServerDto) {
    return this.serversService.createServer(userId, body);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':serverId')
  async getServerDetails(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ): Promise<Server> {
    const serverDocument = await this.serversService.getServer(
      userId,
      serverId,
    );

    return new Server(serverDocument.toJSON());
  }

  @Get(':serverId/channels')
  async getChannels(
    @UserId() userId: string,
    @Param() params: GetChannelsParamsDto,
  ) {
    return this.serversService.getChannels(userId, params.serverId);
  }

  @Get(':serverId/channels/:channelId/rtc-token')
  async getServerChannelRTCToken(
    @UserId() userId: string,
    @Param() params: GetRTCTokenParamsDto,
  ) {
    return this.serversService.getServerChannelRTCToken(
      userId,
      params.serverId,
      params.channelId,
    );
  }
}
