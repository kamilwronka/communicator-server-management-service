import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private client: ClientProxy) {}

  async getUserData(userId: string) {
    const message = userId;
    const record = new RmqRecordBuilder(message)
      .setOptions({
        priority: 1,
        contentType: 'application/json',
      })
      .build();

    return this.client.send({ cmd: 'me' }, record).toPromise();
  }
}
