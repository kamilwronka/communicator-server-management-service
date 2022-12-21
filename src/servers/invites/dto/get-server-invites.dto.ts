import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetServerInvitesParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;
}
