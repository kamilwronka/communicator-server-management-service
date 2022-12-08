import { S3Client } from '@aws-sdk/client-s3';
import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSConfig } from 'src/config/types';
import { ServersModule } from 'src/servers/servers.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    forwardRef(() => ServersModule),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<RabbitMQConfig>('rabbitmq');

        return config;
      },
    }),
  ],
  controllers: [SettingsController],
  providers: [
    SettingsService,
    {
      provide: S3Client,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { accessKeyId, secret } = configService.get<AWSConfig>('aws');

        return new S3Client({
          region: 'eu-central-1',
          credentials: {
            accessKeyId,
            secretAccessKey: secret,
          },
        });
      },
    },
  ],
})
export class SettingsModule {}
