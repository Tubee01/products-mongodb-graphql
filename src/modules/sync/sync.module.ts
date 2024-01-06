import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@libs/config';
import { PrismaModule } from '@libs/prisma';
import { SyncController } from './sync.controller';
import { SYNC_QUEUE_NAME, SyncProcessor } from './sync.processor';
import { CsvReaderService } from './csv-reader.service';
import { SyncProductService } from './sync-product.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueueAsync({
      name: SYNC_QUEUE_NAME,
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SyncController],
  providers: [SyncProcessor, CsvReaderService, SyncProductService],
})
export class SyncModule {}
