import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import {
  CreateMemberDto,
  CreateMemberParamsDto,
} from './dto/create-member.dto';
import { DeleteMemberParamsDto } from './dto/delete-member.dto';
import { GetMembersParamsDto } from './dto/members-params.dto';
import {
  UpdateMemberDto,
  UpdateMemberParamsDto,
} from './dto/update-member.dto';
import { MembersService } from './members.service';
import { Member } from './schemas/member.schema';

@ApiTags('members')
@UseInterceptors(CustomSerializerInterceptor(Member))
@Controller(':serverId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get('')
  async getMembers(@Param() params: GetMembersParamsDto) {
    return this.membersService.getMembers(params);
  }

  @Post('')
  async addMember(
    @UserId() userId: string,
    @Param() params: CreateMemberParamsDto,
    @Body() createMemberData: CreateMemberDto,
  ) {
    return this.membersService.joinServer(
      userId,
      params.serverId,
      createMemberData,
    );
  }

  @Patch(':memberId')
  async editMember(
    @Param() params: UpdateMemberParamsDto,
    @Body() data: UpdateMemberDto,
  ) {
    return this.membersService.updateMember(params.memberId, data);
  }

  @Delete(':memberId')
  async deleteMember(@Param() params: DeleteMemberParamsDto) {
    return this.membersService.deleteMember(params.memberId);
  }
}
