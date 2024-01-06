import { PrismaService } from '@libs/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProducerService {
  constructor(private readonly prismaService: PrismaService) {}

  getById(id: string) {
    return this.prismaService.producer.findUnique({
      where: { id },
    });
  }
}
