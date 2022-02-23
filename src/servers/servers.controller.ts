import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserId } from './decorators/user-id.decorator';
import { CreateServerDto } from './dto/createServer.dto';
import { ServersService } from './servers.service';

@Controller('')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get('list')
  async getServers(@UserId() userId: string) {
    return this.serversService.findUserServers(userId);
  }

  @Post('create')
  async createServer(@UserId() userId: string, @Body() body: CreateServerDto) {
    return this.serversService.createServer(userId, body);
  }
}
