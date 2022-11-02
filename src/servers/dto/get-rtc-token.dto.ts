import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetRTCTokenParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  channelId: string;
}
