import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLastMessageDateDto {
  @IsNotEmpty()
  @IsString()
  date: string;
}
