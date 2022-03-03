import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { configService } from 'src/config/config.service';
import { UsersService } from './users.service';

const { rmqHost, rmqPassword, rmqPort, rmqQueue, rmqUser } =
  configService.getRMQConfig();

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${rmqUser}:${rmqPassword}@${rmqHost}:${rmqPort}/`],
          queue: 'users_service_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class UsersModule {}
