import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  inviteId?: string;

  roles: string[];
}

export class CreateMemberParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;
}
