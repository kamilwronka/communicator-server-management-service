import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { CreateInviteDto } from './dto/create-invite.dto';
import { DeleteInviteParamsDto } from './dto/delete-invite.dto';

@Injectable()
export class InvitesService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(InvitesService.name);

  async getInviteById(inviteId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`/${inviteId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Request to ${error.config.url} failed with status code ${
              error.response.status
            }. Details: ${JSON.stringify(error.response.data)}`,
          );
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async createInvite(userId: string, serverId: string, body: CreateInviteDto) {
    // TODO - add role checking

    const { maxAge, maxUses, validate } = body;

    const requestData = {
      maxAge,
      maxUses,
      validate,
      serverId,
      inviterId: userId,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(``, requestData).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Request to ${error.config.url} failed with status code ${
              error.response.status
            }. Details: ${JSON.stringify(error.response.data)}`,
          );
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async deleteInvite(userId: string, { inviteId }: DeleteInviteParamsDto) {
    // TODO - add role checking

    const { data } = await firstValueFrom(
      this.httpService.delete(`/${inviteId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Request to ${error.config.url} failed with status code ${
              error.response.status
            }. Details: ${JSON.stringify(error.response.data)}`,
          );
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }

  async getServerInvites(userId: string, serverId: string) {
    // TODO - add role checking

    const { data } = await firstValueFrom(
      this.httpService.get(`/servers/${serverId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            `Request to ${error.config.url} failed with status code ${
              error.response.status
            }. Details: ${JSON.stringify(error.response.data)}`,
          );
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }
}
