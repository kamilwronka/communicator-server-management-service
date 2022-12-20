import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsMongoId({ each: true })
  roleIds: string[];
}

export class UpdateMemberParamsDto {
  @IsMongoId()
  serverId: string;

  @IsMongoId()
  memberId: string;
}
