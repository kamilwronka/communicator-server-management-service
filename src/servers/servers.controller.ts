import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CustomSerializerInterceptor } from 'src/common/interceptors/custom-serializer.interceptor';
import { CreateServerDto } from './dto/create-server.dto';
import { Server } from './schemas/server.schema';
import { ServersService } from './servers.service';

@ApiTags('servers')
@Controller('')
@UseInterceptors(CustomSerializerInterceptor(Server))
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get(':serverId')
  async getServerDetails(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ): Promise<Server> {
    return this.serversService.getServer(userId, serverId);
  }

  @Post('')
  async createServer(
    @UserId() userId: string,
    @Body() body: CreateServerDto,
  ): Promise<Server> {
    return this.serversService.createServer(userId, body);
  }
}
