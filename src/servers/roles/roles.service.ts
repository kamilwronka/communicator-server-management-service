import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleParamsDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';
import { ServersService } from 'src/servers/servers.service';
import { DeleteRoleParamsDto } from './dto/delete-role.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RolesRoutingKey } from './enums/roles-routing-key.enum';
import { RestrictedRolesName } from './enums/restricted-roles-name.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleRepository: Model<RoleDocument>,
    @Inject(forwardRef(() => ServersService))
    private readonly serversService: ServersService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getRoleById(id: string) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getRoles(userId: string, serverId: string): Promise<Role[]> {
    const roles = await this.roleRepository.find({ serverId });

    return roles;
  }

  async getDefaultServerRole(serverId: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      serverId,
      name: RestrictedRolesName.DEFAULT,
    });

    if (!role) {
      throw new InternalServerErrorException();
    }

    return role;
  }

  async createRole(
    userId: string,
    serverId: string,
    { name, color, permissions }: CreateRoleDto,
  ): Promise<Role> {
    // const server = await this.serversService.getServer(userId, serverId);

    // check if can manage roles

    const role = await new this.roleRepository({
      name,
      color,
      serverId,
      permissions,
    }).save();
    const json = role.toJSON();

    await this.amqpConnection.publish('default', RolesRoutingKey.ROLE_CREATE, {
      ...json,
      version: json.__v,
    });

    return role;
  }

  async updateRole(
    userId: string,
    { serverId, roleId }: UpdateRoleParamsDto,
    { name, ...updateRoleData }: UpdateRoleDto,
  ) {
    await this.serversService.getServer(userId, serverId);

    // hier checking role management permissions

    const role = await this.getRoleById(roleId);

    if (role.name === RestrictedRolesName.ADMIN) {
      throw new ForbiddenException();
    }

    if (role.name === RestrictedRolesName.DEFAULT && name !== role.name) {
      throw new BadRequestException('cannot change default role name');
    }

    role.name = name;
    Object.entries(updateRoleData).forEach(([key, value]) => {
      role[key] = value;
    });

    const result = await role.save();
    const json = result.toJSON();

    await this.amqpConnection.publish('default', RolesRoutingKey.ROLE_UPDATE, {
      ...json,
      version: json.__v,
    });

    return result;
  }

  async deleteRole(userId: string, { serverId, roleId }: DeleteRoleParamsDto) {
    // check permissiones
    const server = await this.serversService.getServer(userId, serverId);

    await this.roleRepository.deleteOne({ id: roleId });

    await this.amqpConnection.publish('default', RolesRoutingKey.ROLE_DELETE, {
      id: roleId,
    });
  }
}
