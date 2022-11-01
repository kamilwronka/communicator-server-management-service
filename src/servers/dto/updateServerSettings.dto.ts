import { IsOptional, IsString, Matches } from 'class-validator';
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
  @Matches(/^[0-9a-fA-F]{24}$/)
  serverId: string;
}
