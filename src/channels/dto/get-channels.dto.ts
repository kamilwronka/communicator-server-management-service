import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetChannelsParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;
}
