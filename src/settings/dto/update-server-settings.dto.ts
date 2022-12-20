import { IsOptional, IsString, Matches } from 'class-validator';
import { MONGO_ID_REGEX } from 'src/common/constants/validation.constants';
import { ALLOWED_IMAGE_FILE_TYPES } from '../constants/upload.constants';

export class UpdateServerSettingsDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @Matches(ALLOWED_IMAGE_FILE_TYPES)
  icon: string;
}

export class UpdateServerSettingsParamsDto {
  @IsString()
  @Matches(MONGO_ID_REGEX)
  serverId: string;
}
