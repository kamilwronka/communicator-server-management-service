import {
  IsHexColor,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  color: string;
}

export class CreateRoleParamsDto {
  @IsString()
  @IsMongoId()
  serverId: string;
}
