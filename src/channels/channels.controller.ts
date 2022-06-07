import { UserId } from '@communicator/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';

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
