import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/servers/decorators/user-id.decorator';
import { CreateInviteDto } from './dto/createInvite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post(':serverId')
  async createInvite(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Body() body: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(userId, serverId, body);
  }

  @Get(':inviteId')
  async getInvite(@Param('inviteId') inviteId: string) {
    return this.invitesService.getInvite(inviteId);
  }

  @Delete(':inviteId')
  async deleteInvite(
    @UserId() userId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invitesService.deleteInvite(userId, inviteId);
  }

  @Get('server/:serverId')
  async getServerInvites(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ) {
    return this.invitesService.getServerInvites(userId, serverId);
  }
}
