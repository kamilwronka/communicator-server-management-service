import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { UserId } from 'src/decorators/userId.decorator';
import { CreateRoleDto, CreateRoleParamsDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleParamsDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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
}
