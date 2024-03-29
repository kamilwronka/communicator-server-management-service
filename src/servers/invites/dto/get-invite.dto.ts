import { IsMongoId } from 'class-validator';

export class GetInviteParamsDto {
  @IsMongoId()
  inviteId: string;
}
