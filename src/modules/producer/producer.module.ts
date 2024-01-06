import { Module } from '@nestjs/common';
import { PrismaModule } from '@libs/prisma';
import { ProducerResolver } from './producer.resolver';
import { ProducerService } from './producer.service';

@Module({
  imports: [PrismaModule],
  providers: [ProducerResolver, ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}
