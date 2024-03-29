import { IsMongoId } from 'class-validator';

export class DeleteMemberParamsDto {
  @IsMongoId()
  memberId: string;

  @IsMongoId()
  serverId: string;
}
