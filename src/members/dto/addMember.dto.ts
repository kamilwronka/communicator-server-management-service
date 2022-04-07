import { IsNotEmpty, IsString } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  @IsString()
  inviteId: string;
}
