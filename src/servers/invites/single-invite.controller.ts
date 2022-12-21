import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import { GetInviteParamsDto } from './dto/get-invite.dto';
import { InvitesService } from './invites.service';
import { Invite } from './schemas/invite.schema';

@ApiTags('invites')
@UseGuards(AuthGuard)
@UseInterceptors(CustomSerializerInterceptor(Invite))
@Controller('invites')
export class SingleInviteController {
  constructor(private invitesService: InvitesService) {}

  @Get(':inviteId')
  @HttpCode(HttpStatus.OK)
  async getInvites(
    @UserId() userId: string,
    @Param() params: GetInviteParamsDto,
  ): Promise<Invite> {
    return this.invitesService.getInvite(params.inviteId);
  }
}
