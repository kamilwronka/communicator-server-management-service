import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/userId.decorator';
import {
  CreateMemberDto,
  CreateMemberParamsDto,
} from './dto/create-member.dto';
import { MembersService } from './members.service';

@ApiTags('members')
@Controller('')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Post(':serverId/members')
  async addMember(
    @UserId() userId: string,
    @Param() params: CreateMemberParamsDto,
    @Body() createMemberData: CreateMemberDto,
  ) {
    return this.membersService.createMember(
      userId,
      params.serverId,
      createMemberData,
    );
  }
}
