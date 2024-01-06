import { PrismaService } from '@libs/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dtos/create-product.input';
import { UpdateProductInput } from './dtos/update-product.input';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) { }

  async getById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  getByProducerId(producerId: string) {
    return this.prismaService.product.findMany({
      where: { producerId },
    });
  }

  createMany(data: CreateProductInput[]) {
    return this.prismaService.product.createMany({
      data,
    });
  }

  async update(id: string, data: UpdateProductInput) {
    if (!(await this.isExist(id))) {
      throw new NotFoundException();
    }

    return this.prismaService.product.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async delete(id: string) {
    if (!(await this.isExist(id))) {
      throw new NotFoundException();
    }
    return this.prismaService.product.delete({
      where: { id },
    });
  }

  async isExist(id: string) {
    const count = await this.prismaService.product.count({
      where: { id },
    });

    return !!count;
  }
}
