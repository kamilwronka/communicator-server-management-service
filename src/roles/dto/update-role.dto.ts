import {
  IsEnum,
  IsHexColor,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Permissions } from '../enums/permissions.enum';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(Permissions, { each: true })
  permissions: Permissions[];

  @IsOptional()
  @IsString()
  @IsHexColor()
  color: string;
}

export class UpdateRoleParamsDto {
  @IsString()
  @IsMongoId()
  serverId: string;

  @IsString()
  @IsMongoId()
  roleId: string;
}
