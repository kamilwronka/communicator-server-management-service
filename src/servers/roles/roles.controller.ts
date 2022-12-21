import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CustomSerializerInterceptor } from '../../common/interceptors/custom-serializer.interceptor';
import { CreateRoleDto, CreateRoleParamsDto } from './dto/create-role.dto';
import { DeleteRoleParamsDto } from './dto/delete-role.dto';
import { GetRolesParamsDto } from './dto/get-roles.dto';
import { UpdateRoleDto, UpdateRoleParamsDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { Role } from './schemas/role.schema';

@UseInterceptors(CustomSerializerInterceptor(Role))
@UseGuards(AuthGuard)
@Controller('')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':serverId/roles')
  async getRoles(@UserId() userId: string, @Param() params: GetRolesParamsDto) {
    return this.rolesService.getRoles(userId, params.serverId);
  }

  @Post(':serverId/roles')
  async createRole(
    @UserId() userId: string,
    @Param() params: CreateRoleParamsDto,
    @Body() createRoleData: CreateRoleDto,
  ) {
    return this.rolesService.createRole(
      userId,
      params.serverId,
      createRoleData,
    );
  }

  @Patch(':serverId/roles/:roleId')
  async updateRole(
    @UserId() userId: string,
    @Param() params: UpdateRoleParamsDto,
    @Body() createRoleData: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(userId, params, createRoleData);
  }

  @Delete(':serverId/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(
    @UserId() userId: string,
    @Param() params: DeleteRoleParamsDto,
  ) {
    await this.rolesService.deleteRole(userId, params);
    return;
  }
}
