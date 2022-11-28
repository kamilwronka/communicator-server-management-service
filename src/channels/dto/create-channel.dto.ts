import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChannelType } from 'src/channels/types';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsOptional()
  @IsString()
  @IsMongoId()
  parentId?: string;
}

export class CreateChannelParamsDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  serverId: string;
}
