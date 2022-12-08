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

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @Inject(forwardRef(() => ServersService))
    private readonly serversService: ServersService,
  ) {}

  async getRoleById(id: string) {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async getRoles(userId: string, serverId: string): Promise<Role[]> {
    const server = await this.serversService.getServer(userId, serverId);

    return server.roles;
  }

  async createRole(
    userId: string,
    serverId: string,
    { name, color }: CreateRoleDto,
  ): Promise<Role> {
    const server = await this.serversService.getServer(userId, serverId);

    // check if can manage roles

    const role = await new this.roleModel({ name, color }).save();
    server.roles.push(role);

    await server.save();

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

    return role.save();
  }

  async deleteRole(userId: string, { serverId, roleId }: DeleteRoleParamsDto) {
    // check permissiones
    const server = await this.serversService.getServer(userId, serverId);

    // cleanup
    server.roles = server.roles.filter(
      (role) => role._id.toString() !== roleId,
    );
    await server.save();

    return this.roleModel.findByIdAndDelete(roleId);
  }
}
