import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserId } from 'src/decorators/userId.decorator';
import { AddMemberDto } from './dto/addMember.dto';
import { MembersService } from './members.service';

@Controller('')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Post(':serverId/members')
  async addMember(
    @UserId() userId: string,
    @Param('serverId') serverId: string,
    @Body() body: AddMemberDto,
  ) {
    return this.membersService.addMember(userId, serverId, body.inviteId);
  }
}
