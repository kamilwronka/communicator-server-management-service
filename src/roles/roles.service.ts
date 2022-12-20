import {
  forwardRef,
  Inject,
  Injectable,
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
import { RoutingKeys } from '../common/enums/routing-keys.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @Inject(forwardRef(() => ServersService))
    private readonly serversService: ServersService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async getRoleById(id: string) {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getRoles(userId: string, serverId: string): Promise<Role[]> {
    const roles = await this.roleModel.find({ serverId });

    return roles;
  }

  async createRole(
    userId: string,
    serverId: string,
    { name, color, permissions }: CreateRoleDto,
  ): Promise<Role> {
    // const server = await this.serversService.getServer(userId, serverId);

    // check if can manage roles

    const role = await new this.roleModel({
      name,
      color,
      serverId,
      permissions,
    }).save();
    const json = role.toJSON();

    await this.amqpConnection.publish('default', RoutingKeys.ROLE_CREATE, {
      ...json,
      version: json.__v,
    });

    return role;
  }

  async updateRole(
    userId: string,
    { serverId, roleId }: UpdateRoleParamsDto,
    updateRoleData: UpdateRoleDto,
  ) {
    await this.serversService.getServer(userId, serverId);

    // hier checking role management permissions

    const role = await this.getRoleById(roleId);

    Object.entries(updateRoleData).forEach(([key, value]) => {
      role[key] = value;
    });

    const result = await role.save();
    const json = result.toJSON();

    await this.amqpConnection.publish('default', RoutingKeys.ROLE_UPDATE, {
      ...json,
      version: json.__v,
    });

    return result;
  }

  async deleteRole(userId: string, { serverId, roleId }: DeleteRoleParamsDto) {
    // check permissiones
    const server = await this.serversService.getServer(userId, serverId);

    await this.roleModel.deleteOne({ id: roleId });

    await this.amqpConnection.publish('default', RoutingKeys.ROLE_DELETE, {
      id: roleId,
    });
  }
}
