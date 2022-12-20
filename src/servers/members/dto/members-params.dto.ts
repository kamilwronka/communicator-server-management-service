import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetMembersParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  serverId: string;
}

export class ManageMembersParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  serverId: string;

  @IsNotEmpty()
  @IsMongoId()
  memberId: string;
}
