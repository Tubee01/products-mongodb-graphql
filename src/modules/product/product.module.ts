import { PrismaModule } from '@libs/prisma';
import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [PrismaModule, ProducerModule],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
