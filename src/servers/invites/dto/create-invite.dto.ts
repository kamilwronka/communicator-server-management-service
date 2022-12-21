import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsOptional()
  @IsString()
  validate?: string;

  @IsNotEmpty()
  maxAge: number;

  @IsNotEmpty()
  maxUses: number;
}

export class CreateInviteParamsDto {
  @IsNotEmpty()
  @IsMongoId()
  serverId: string;
}
