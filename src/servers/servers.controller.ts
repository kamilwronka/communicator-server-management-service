import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/userId.decorator';
import { CustomSerializerInterceptor } from 'src/interceptors/custom-serializer.interceptor';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@ApiTags('servers')
@Controller('')
@UseInterceptors(CustomSerializerInterceptor(Server))
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get('')
  async getServers(@UserId() userId: string): Promise<Server[]> {
    return this.serversService.findServersByUserId(userId);
  }

  @Post('')
  async createServer(
    @UserId() userId: string,
    @Body() body: CreateServerDto,
  ): Promise<Server> {
    return this.serversService.createServer(userId, body);
  }

  @Get(':serverId')
  async getServerDetails(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ): Promise<Server> {
    return this.serversService.getServer(userId, serverId);
  }

  @Get('internal/:serverId')
  async getInternalServerDetails(
    @Param('serverId') serverId: string,
  ): Promise<Server> {
    return this.serversService.findServerById(serverId);
  }
}
