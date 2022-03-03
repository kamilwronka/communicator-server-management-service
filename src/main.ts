import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const { rmqHost, rmqPassword, rmqQueue, rmqPort, rmqUser } =
    configService.getRMQConfig();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rmqUser}:${rmqPassword}@${rmqHost}:${rmqPort}/`],
      queue: rmqQueue,
      queueOptions: {
        durable: false,
      },
    },
  });

  const port = configService.getPort();
  const isProduction = configService.isProduction();

  Logger.log('Starting application using following config:');
  Logger.log(`Port: ${port}`);
  Logger.log(`Is production: ${isProduction}`);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
}
bootstrap();
