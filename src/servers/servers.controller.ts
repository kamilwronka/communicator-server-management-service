import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserId } from './decorators/user-id.decorator';
import { CreateServerDto } from './dto/createServer.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get('list')
  async getServers(@UserId() userId: string) {
    return this.serversService.findUserServers(userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':serverId')
  async getServerDetails(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ): Promise<Server> {
    return this.serversService.getServerDetails(userId, serverId);
  }

  @Post('create')
  async createServer(@UserId() userId: string, @Body() body: CreateServerDto) {
    return this.serversService.createServer(userId, body);
  }
}
