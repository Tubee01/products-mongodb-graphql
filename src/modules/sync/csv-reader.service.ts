import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';
import csv from 'csv-parser';

interface CsvReaderOptions {
  batchSize: number;
  processRows: (data: unknown) => Promise<unknown> | void;
}

@Injectable()
export class CsvReaderService {
  private readonly logger = new Logger(this.constructor.name);

  async fromUrl(path: string, options: CsvReaderOptions) {
    this.logger.debug(`Reading CSV from URL: ${path}`);

    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Failed to fetch CSV from URL: ${path}`);
    }

    const body = res.body as ReadableStream;
    const stream = Readable.fromWeb(body);

    try {
      return await this.handleStream(stream, options);
    } catch (error) {
      stream.destroy();
      this.logger.error(`Failed to read CSV from URL: ${path}`);

      return null;
    }
  }

  private async handleStream(stream: NodeJS.ReadableStream, options: CsvReaderOptions) {
    const { processRows, batchSize } = options;
    const batchData = [];

    for await (const row of stream.pipe(csv())) {
      batchData.push(row);

      if (batchData.length >= batchSize) {
        await processRows(batchData);
        batchData.length = 0;
      }
    }

    if (batchData.length) {
      await processRows(batchData);
    }
  }
}
