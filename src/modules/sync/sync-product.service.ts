import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';
import { Producer, Product } from '@prisma/client';

interface ProductCsvRow {
  Vintage: string;
  'Product Name': string;
  Producer: string;
  Country: string;
  Region: string;
  Colour: string;
  Quantity: string;
  Format: string;
  'Price (GBP)': string;
  Duty: string;
  Availability: string;
  Conditions: string;
  ImageUrl: string;
}

type ValidProductCsvRowKeys = Pick<ProductCsvRow, 'Vintage' | 'Product Name'>;

type ValidProducerCsvRowKeys = Pick<ProductCsvRow, 'Producer' | 'Country' | 'Region'>;

type ValidProductKeys = Pick<Product, 'name' | 'vintage'>;

type ValidProducerKeys = Pick<Producer, 'name' | 'country' | 'region'>;

const PRODUCT_ROW_MAPPINGS: Record<keyof ValidProductCsvRowKeys, keyof ValidProductKeys> = {
  'Product Name': 'name',
  Vintage: 'vintage',
};

const PRODUCER_ROW_MAPPINGS: Record<keyof ValidProducerCsvRowKeys, keyof ValidProducerKeys> = {
  Producer: 'name',
  Country: 'country',
  Region: 'region',
};

@Injectable()
export class SyncProductService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly prisma: PrismaService) {}

  async sync(rows: ProductCsvRow[]) {
    const groupedRows = this.groupByUniqueKeys(rows, ['Vintage', 'Product Name', 'Producer']);
    const productsPromises = [];
    const dbProcuders: Producer[] = [];

    this.logger.debug(`Syncing ${rows.length} products`);

    for await (const uniqueKey of groupedRows.keys()) {
      const data = this.getAllValuesForKey(groupedRows, uniqueKey);
      for (const row of data) {
        const producer = this.mapRowToProducer(row);

        if (!producer.name) {
          this.logger.warn(`Producer name is empty: ${row['Product Name']}`);
          return;
        }

        let dbProducer = dbProcuders.find((p) =>
          ['name', 'country', 'region'].every((key) => p[key] === producer[key]),
        );

        if (!dbProducer) {
          this.logger.debug(`Syncing producer: ${producer.name}`);
          dbProducer = await this.prisma.producer.upsert({
            where: {
              name_country_region: { name: producer.name, country: producer.country, region: producer.region },
            },
            create: producer,
            update: producer,
          });
          dbProcuders.push(dbProducer);
        }

        const product = this.mapRowToProduct(row);

        productsPromises.push(
          this.prisma.product.upsert({
            where: {
              vintage_name_producerId: {
                vintage: product.vintage,
                name: product.name,
                producerId: dbProducer.id,
              },
            },
            create: { ...product, producer: { connect: { id: dbProducer.id } } },
            update: product,
          }),
        );
      }
    }

    await this.prisma.$transaction(productsPromises);

    this.logger.debug(`Synced ${rows.length} products`);
  }

  private mapRowToProduct(row: ProductCsvRow) {
    return this.mapRowToDbFields<ValidProductKeys>(row, PRODUCT_ROW_MAPPINGS);
  }

  private mapRowToProducer(row: ProductCsvRow) {
    return this.mapRowToDbFields<ValidProducerKeys>(row, PRODUCER_ROW_MAPPINGS);
  }

  private mapRowToDbFields<T>(row: ProductCsvRow, mappings: Record<string, string>) {
    return Object.entries(mappings).reduce((acc, [key, value]) => {
      acc[value] = row[key];

      return acc;
    }, {} as T);
  }

  private groupByUniqueKeys(
    rows: ProductCsvRow[],
    keys: (keyof ValidProductCsvRowKeys | keyof ValidProducerCsvRowKeys)[],
  ) {
    const groupedRows = new Map<string, ProductCsvRow>();

    for (const row of rows) {
      const uniqueKey = keys.map((key) => row[key]).join('-');

      groupedRows.set(uniqueKey, row);
    }

    return groupedRows;
  }

  private getAllValuesForKey(map: Map<string, ProductCsvRow>, key: string) {
    const values: ProductCsvRow[] = [];
    for (const [mapKey, mapValue] of map) {
      if (mapKey === key) {
        values.push(mapValue);
      }
    }
    return values;
  }
}
