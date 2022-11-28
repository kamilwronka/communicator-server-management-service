import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DeleteInviteParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  inviteId: string;
}
