import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IAppConfig } from './config/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  const { port } = configService.get<IAppConfig>('app');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Servers')
    .setDescription('Servers')
    .setVersion('0.0.1')
    .addTag('servers')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  Logger.log(`Starting application on port: ${port}`);
  await app.listen(port);
}
bootstrap();
