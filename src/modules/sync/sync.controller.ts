import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SYNC_QUEUE_NAME } from './sync.processor';

@Controller('sync')
export class SyncController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectQueue(SYNC_QUEUE_NAME) private readonly syncQueue: Queue) {}

  @Get()
  async start(@Query('path') path?: string, @Query('batchSize') batchSize?: string) {
    if ((await this.syncQueue.getActiveCount()) > 0) {
      this.logger.debug('Sync already in progress');
      return false;
    }

    await this.syncQueue.add('sync', {
      path,
      batchSize: batchSize ? Number(batchSize) : undefined,
    });

    this.logger.debug('Sync started');
    return true;
  }
}
