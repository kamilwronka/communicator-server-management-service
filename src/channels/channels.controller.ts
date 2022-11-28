import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/userId.decorator';
import { ChannelsService } from './channels.service';
import {
  CreateChannelDto,
  CreateChannelParamsDto,
} from './dto/create-channel.dto';
import { GetChannelsParamsDto } from './dto/get-channels.dto';
import { GetRTCTokenParamsDto } from './dto/get-rtc-token.dto';
import { Channel } from './types';

@ApiTags('channels')
@Controller('')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get(':serverId/channels')
  async getChannels(
    @UserId() userId: string,
    @Param() params: GetChannelsParamsDto,
  ): Promise<Channel[]> {
    return this.channelsService.getChannels(userId, params.serverId);
  }

  @Post(':serverId/channels')
  async create(
    @UserId() userId: string,
    @Param() params: CreateChannelParamsDto,
    @Body() data: CreateChannelDto,
  ): Promise<Channel> {
    return this.channelsService.create(userId, params.serverId, data);
  }

  @Get(':serverId/channels/:channelId/rtc-token')
  async getServerChannelRTCToken(
    @UserId() userId: string,
    @Param() params: GetRTCTokenParamsDto,
  ) {
    return this.channelsService.getChannelRTCToken(userId, params);
  }
}
