import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EChannelType } from 'src/channels/types';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(EChannelType)
  type: EChannelType;

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
