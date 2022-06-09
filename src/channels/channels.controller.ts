import { UserId } from '@communicator/common';
import { Patch } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto, User } from './dto/create-channel.dto';
import { UpdateLastMessageDateDto } from './dto/update-last-message-date.dto';

@Controller('')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get('private/channels')
  async getPrivateChannels(@UserId() userId: string) {
    return this.channelsService.getPrivateChannels(userId);
  }

  @Post('private/channels')
  async createPrivateChannel(@Body() createChannelData: CreateChannelDto) {
    return this.channelsService.createChannel(createChannelData);
  }

  @Patch('private/channels/:channelId')
  async updateLastMessageDate(
    @Param('channelId') channelId: string,
    @Body() data: UpdateLastMessageDateDto,
  ) {
    return this.channelsService.updateLastMessageDate(channelId, data);
  }

  @Get(':serverId/channels')
  async getServerChannels(@Param('serverId') serverId: string) {
    return this.channelsService.getServerChannels(serverId);
  }

  @Post(':serverId/channels')
  async createChannel(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Body() createChannelData: CreateChannelDto,
  ) {
    return this.channelsService.createChannel(
      createChannelData,
      userId,

      serverId,
    );
  }

  @Get(':serverId/channels/:channelId/token')
  async getRTCToken(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelsService.getRTCToken(userId, serverId, channelId);
  }
}
