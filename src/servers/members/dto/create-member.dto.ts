import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { MONGO_ID_REGEX } from 'src/constants/validation.constants';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @Matches(MONGO_ID_REGEX)
  inviteId: string;
}

export class CreateMemberParamsDto {
  @IsNotEmpty()
  @IsString()
  @Matches(MONGO_ID_REGEX)
  serverId: string;
}
