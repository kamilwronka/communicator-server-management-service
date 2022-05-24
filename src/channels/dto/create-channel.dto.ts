import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ChannelType } from '../enums/channelTypes.enum';
import { PermissionType } from '../enums/permission-type.enum';

export class PermissionOverwrite {
  @IsNotEmpty()
  @IsBoolean()
  allow: boolean;

  @IsNotEmpty()
  @IsEnum(PermissionType)
  type: PermissionType;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class User {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  profile_picture_url?: string;
}

export class CreateChannelDto {
  @ValidateIf((o: CreateChannelDto) => {
    return o.type !== ChannelType.PRIVATE;
  })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsOptional()
  @IsString()
  @Matches(/^[a-f\d]{24}$/i)
  parent_id?: string;

  @ValidateIf((o: CreateChannelDto) => {
    return o.type === ChannelType.PRIVATE;
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => User)
  users?: User[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionOverwrite)
  permissions_overwrites?: PermissionOverwrite[];
}
