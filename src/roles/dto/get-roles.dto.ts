import { IsMongoId } from 'class-validator';

export class GetRolesParamsDto {
  @IsMongoId()
  serverId: string;
}
