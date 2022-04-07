import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from '@communicator/common';
import { CreateInviteDto } from './dto/createInvite.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller('')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}
  // temporary solution, because no invites api yet
  @Get('invites/:inviteId')
  async getInvite(@Param('inviteId') inviteId: string) {
    return this.invitesService.getInvite(inviteId);
  }

  @Get(':serverId/invites')
  async getServerInvites(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
  ) {
    return this.invitesService.getServerInvites(userId, serverId);
  }

  @Post(':serverId/invites')
  async createInvite(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Body() body: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(userId, serverId, body);
  }

  @Delete(':serverId/invites/:inviteId')
  async deleteInvite(
    @UserId() userId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.invitesService.deleteInvite(userId, inviteId);
  }
}
