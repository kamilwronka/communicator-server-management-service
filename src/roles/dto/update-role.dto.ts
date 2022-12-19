import {
  IsEnum,
  IsHexColor,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];

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
