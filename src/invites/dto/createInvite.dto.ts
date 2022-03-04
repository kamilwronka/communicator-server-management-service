import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsOptional()
  @IsString()
  validate?: string;

  @IsNotEmpty()
  max_age: number;

  @IsNotEmpty()
  max_uses: number;
}
