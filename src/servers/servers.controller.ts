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
import { UserId } from '@communicator/common';
import { CreateServerDto } from './dto/createServer.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@ApiTags('servers')
@Controller('')
export class ServersController {
  constructor(private serversService: ServersService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  async getServers(@UserId() userId: string): Promise<Server[]> {
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

  @Post('')
  async createServer(@UserId() userId: string, @Body() body: CreateServerDto) {
    return this.serversService.createServer(userId, body);
  }
}
