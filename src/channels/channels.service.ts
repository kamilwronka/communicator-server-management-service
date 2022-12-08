import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { logAxiosError } from 'src/helpers/logAxiosError.helper';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetRTCTokenParamsDto } from './dto/get-rtc-token.dto';
import { Channel, GetRTCTokenResponse } from './types';

@Injectable()
export class ChannelsService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(ChannelsService.name);

  async getChannels(userId: string, serverId: string): Promise<Channel[]> {
    // check roles

    const { data } = await firstValueFrom(
      this.httpService.get<Channel[]>(`/internal/servers/${serverId}`).pipe(
        catchError((error: AxiosError) => {
          logAxiosError(this.logger, error);
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async create(
    userId: string,
    serverId: string,
    data: CreateChannelDto,
  ): Promise<Channel> {
    // check roles

    const requestData = { ...data, serverId };

    const { data: responseData } = await firstValueFrom(
      this.httpService.post<Channel>(`/internal/servers`, requestData).pipe(
        catchError((error: AxiosError) => {
          logAxiosError(this.logger, error);
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return responseData;
  }

  async getChannelRTCToken(
    userId: string,
    { channelId }: GetRTCTokenParamsDto,
  ): Promise<GetRTCTokenResponse> {
    // add role check

    const { data } = await firstValueFrom(
      this.httpService
        .get<GetRTCTokenResponse>(
          `/${channelId}/server-rtc-token?userId=${userId}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            logAxiosError(this.logger, error);
            throw new BadGatewayException(error.message);
          }),
        ),
    );

    return data;
  }
}
