import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { MONGO_ID_REGEX } from 'src/common/constants/validation.constants';

export class UploadServerImageDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsNumber()
  fileSize: number;
}

export class UploadServerImageParamsDto {
  @IsString()
  @Matches(MONGO_ID_REGEX)
  serverId: string;
}
