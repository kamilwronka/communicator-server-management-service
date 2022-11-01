import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

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
  @Matches(/^[0-9a-fA-F]{24}$/)
  serverId: string;
}
