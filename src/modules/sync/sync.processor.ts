import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@libs/config';
import { CsvReaderService } from './csv-reader.service';
import { SyncProductService } from './sync-product.service';

export const SYNC_QUEUE_NAME = 'sync';

@Processor(SYNC_QUEUE_NAME)
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly csvReaderService: CsvReaderService,
    private readonly syncProductService: SyncProductService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.debug('Processing');
    const {
      data: { path = this.configService.get('CSV_URL'), batchSize = this.configService.get('BATCH_SIZE') },
    } = job;

    const processRows = (rows) => this.syncProductService.sync(rows);

    await this.csvReaderService.fromUrl(path, {
      batchSize,
      processRows,
    });
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.debug('Completed');
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(error);
  }
}
