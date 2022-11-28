import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  inviteId: string;
}

export class CreateMemberParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;
}
