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
  async getServerChannels() {
    return 'dupa';
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
}
