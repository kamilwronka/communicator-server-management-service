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
import { JoinServerDto } from './dto/joinServer.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@ApiTags('servers')
@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  @Get('list')
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

  @Post('create')
  async createServer(@UserId() userId: string, @Body() body: CreateServerDto) {
    return this.serversService.createServer(userId, body);
  }

  @Post('join/:serverId')
  async joinServer(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Body() body: JoinServerDto,
  ) {
    return this.serversService.joinServer(userId, serverId, body.inviteId);
  }
}
