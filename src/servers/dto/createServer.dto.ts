import { IsBase64, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsBase64()
  image_file: string;
}
