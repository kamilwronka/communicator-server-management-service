import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private httpService: HttpService) {}

  async getUserData(userId: string): Promise<any> {
    const response = this.httpService.get(
      `http://users-service:4000/users/data/${userId}`,
    );

    const userData = await response.toPromise();

    return userData.data;

    // return response.pipe(
    //   catchError((e) => {
    //     throw new BadRequestException(e.response.data);
    //   }),
    //   map((res) => res.data),
    // );
  }
}
