import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  await configService.setup(['ENV', 'PORT']);
  const app = await NestFactory.create(AppModule, { cors: true });

  const port = configService.getPort();
  const isProduction = configService.isProduction();

  Logger.log('Starting application using following config:');
  Logger.log(`Port: ${port}`);
  Logger.log(`Is production: ${isProduction}`);

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
  await app.listen(port);
}
bootstrap();
