import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { TUserData } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(UsersService.name);

  async getUserById(userId: string): Promise<TUserData> {
    const { data } = await firstValueFrom(
      this.httpService.get<TUserData>(`/${userId}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.message);
          throw new BadGatewayException(error.message);
        }),
      ),
    );

    return data;
  }
}
