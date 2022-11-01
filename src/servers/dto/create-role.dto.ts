import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
export class CreateRoleParamsDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/)
  serverId: string;
}
