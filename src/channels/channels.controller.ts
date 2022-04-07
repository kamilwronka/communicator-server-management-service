import { Controller, Get, Post } from '@nestjs/common';

@Controller('')
export class ChannelsController {
  @Get(':serverId/channels')
  getChannels() {
    return 'dupa';
  }

  @Post(':serverId/channels')
  createChannel() {
    return 'created';
  }
}
