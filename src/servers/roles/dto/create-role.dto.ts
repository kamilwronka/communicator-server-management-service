import {
  IsEnum,
  IsHexColor,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Permission } from '../enums/permission.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}

export class CreateRoleParamsDto {
  @IsString()
  @IsMongoId()
  serverId: string;
}
