import { IsString } from 'class-validator';

export class GetUserServersParamsDto {
  @IsString()
  userId: string;
}
