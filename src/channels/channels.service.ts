import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  TChannel,
  TCreateServerChannelRequestBody,
  TGetRTCTokenResponse,
} from './types';

@Injectable()
export class ChannelsService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(ChannelsService.name);

  async getServerChannels(serverId: string): Promise<TChannel[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<TChannel[]>(`/servers/${serverId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async createServerChannel(
    serverId: string,
    requestBody: TCreateServerChannelRequestBody,
  ): Promise<TChannel> {
    const { data } = await firstValueFrom(
      this.httpService.post<TChannel>(`/servers/${serverId}`, requestBody).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async getServerChannelRTCToken(
    userId: string,
    channelId: string,
  ): Promise<TGetRTCTokenResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<TGetRTCTokenResponse>(
          `/${channelId}/server-rtc-token?userId=${userId}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw new BadGatewayException(error.message);
          }),
        ),
    );

    return data;
  }
}
