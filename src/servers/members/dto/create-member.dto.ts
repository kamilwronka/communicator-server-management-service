import { IsMongoId } from 'class-validator';

export class CreateMemberDto {
  @IsMongoId()
  inviteId: string;
}

export class CreateMemberParamsDto {
  @IsMongoId()
  serverId: string;
}
