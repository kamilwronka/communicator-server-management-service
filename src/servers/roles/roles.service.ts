import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleParamsDto } from './dto/update-role.dto';
import { Role } from './schemas/role.schema';
import { Server, ServerDocument } from '../schemas/server.schema';
import { ServersService } from '../servers.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Server.name) private serverModel: Model<ServerDocument>,
    private readonly serversService: ServersService,
  ) {}

  async createRole(
    userId: string,
    serverId: string,
    { name }: CreateRoleDto,
  ): Promise<Role> {
    const server = await this.serversService.getServer(userId, serverId);

    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const roleId = new Types.ObjectId();
    const role = new Role({ name, permissions: [], color: null, _id: roleId });

    server.roles.push(role);

    const updatedServer = await server.save();

    return updatedServer.roles.find((role) => role._id === roleId);
  }

  async updateRole(
    userId: string,
    { serverId, roleId }: UpdateRoleParamsDto,
    updateRoleData: UpdateRoleDto,
  ) {
    const server = await this.serversService.getServer(userId, serverId);

    if (server.owner_id !== userId) {
      throw new ForbiddenException();
    }

    const updatedRoles = server.roles.map((role) => {
      if (role._id.toString() === roleId) {
        const updatedRole = { ...role };
        const changedValues = Object.keys(updateRoleData);
        changedValues.forEach((key) => {
          updatedRole[key] = updateRoleData[key];
        });

        return updatedRole;
      }

      return role;
    });

    server.roles = updatedRoles;
    const updated = await server.save();

    return updated.roles.find((role) => role._id.toString() === roleId);
  }
}
