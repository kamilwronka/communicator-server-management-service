import { IsMongoId, IsString } from 'class-validator';

export class DeleteRoleParamsDto {
  @IsString()
  @IsMongoId()
  serverId: string;

  @IsString()
  @IsMongoId()
  roleId: string;
}
