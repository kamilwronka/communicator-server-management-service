import { IsMongoId } from 'class-validator';

export class GetServerEventsParamsDto {
  @IsMongoId()
  serverId: string;
}
