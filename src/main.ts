import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { version } from '../package.json';
import { description, name } from '../service.json';

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

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag(name)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
}
bootstrap();
