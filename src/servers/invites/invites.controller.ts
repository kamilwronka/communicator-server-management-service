import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import {
  CreateInviteDto,
  CreateInviteParamsDto,
} from './dto/create-invite.dto';
import { DeleteInviteParamsDto } from './dto/delete-invite.dto';
import { GetServerInvitesParamsDto } from './dto/get-server-invites.dto';
import { InvitesService } from './invites.service';
import { Invite } from './schemas/invite.schema';

@ApiTags('invites')
@UseGuards(AuthGuard)
@UseInterceptors(CustomSerializerInterceptor(Invite))
@Controller(':serverId/invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getInvites(
    @UserId() userId: string,
    @Param() params: GetServerInvitesParamsDto,
  ): Promise<Invite[]> {
    return this.invitesService.getInvitesByServerId(params.serverId);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createInvite(
    @UserId() userId: string,
    @Param() params: CreateInviteParamsDto,
    @Body() body: CreateInviteDto,
  ): Promise<Invite> {
    return this.invitesService.createInvite(userId, params.serverId, body);
  }

  @Delete(':inviteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvite(
    @UserId() userId: string,
    @Param() params: DeleteInviteParamsDto,
  ): Promise<void> {
    await this.invitesService.deleteInvite(params.serverId);
    return;
  }
}
