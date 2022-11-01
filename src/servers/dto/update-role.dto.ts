import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { EPermissions } from '../enums/permissions.enum';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(EPermissions, { each: true })
  permissions: EPermissions[];

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  color: string;
}
export class UpdateRoleParamsDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/)
  serverId: string;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/)
  roleId: string;
}
