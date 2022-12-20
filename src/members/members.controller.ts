import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/userId.decorator';
import { CustomSerializerInterceptor } from '../common/interceptors/custom-serializer.interceptor';
import {
  CreateMemberDto,
  CreateMemberParamsDto,
} from './dto/create-member.dto';
import { GetMembersParamsDto } from './dto/members-params.dto';
import { MembersService } from './members.service';
import { Member } from './schemas/member.schema';

@ApiTags('members')
@UseInterceptors(CustomSerializerInterceptor(Member))
@Controller('')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get(':serverId/members')
  async getMembers(
    @UserId() userId: string,
    @Param() params: GetMembersParamsDto,
  ) {
    return this.membersService.getMembers(userId, params);
  }

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
