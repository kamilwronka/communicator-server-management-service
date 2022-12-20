import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import {
  CreateInviteDto,
  CreateInviteParamsDto,
} from './dto/create-invite.dto';
import { DeleteInviteParamsDto } from './dto/delete-invite.dto';
import { GetServerInvitesParamsDto } from './dto/get-server-invites.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller('')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Get(':serverId/invites')
  async getServerInvites(
    @UserId() userId: string,
    @Param() params: GetServerInvitesParamsDto,
  ) {
    return this.invitesService.getServerInvites(userId, params.serverId);
  }

  @Post(':serverId/invites')
  async createInvite(
    @UserId() userId: string,
    @Param() params: CreateInviteParamsDto,
    @Body() body: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(userId, params.serverId, body);
  }

  @Delete(':serverId/invites/:inviteId')
  async deleteInvite(
    @UserId() userId: string,
    @Param() params: DeleteInviteParamsDto,
  ) {
    return this.invitesService.deleteInvite(userId, params);
  }
}
