import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProducerWithoutRelation } from '@modules/producer/models/producer-without-relation.model';
import { ProductService } from './product.service';
import { ProducerService } from '../producer/producer.service';
import { CreateProductInput } from './dtos/create-product.input';
import { UpdateProductInput } from './dtos/update-product.input';
import { Product } from './models/product.model';
import { ProductWithoutRelation } from './models/product-without-relation.model';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly producerService: ProducerService,
  ) {}

  @Query(() => Product)
  getById(@Args('id') id: string) {
    return this.productService.getById(id);
  }

  @Query(() => [ProductWithoutRelation])
  getByProducerId(@Args('producerId') producerId: string) {
    return this.productService.getByProducerId(producerId);
  }

  @ResolveField('producer', () => ProducerWithoutRelation)
  getProducer(@Parent() product: Product) {
    const { producerId } = product;

    return this.producerService.getById(producerId);
  }

  @Mutation(() => Boolean)
  async createManyProducts(@Args('data', { type: () => [CreateProductInput] }) data: CreateProductInput[]) {
    return !!(await this.productService.createMany(data));
  }

  @Mutation(() => Product)
  updateProduct(@Args('id') id: string, @Args('data') data: UpdateProductInput) {
    return this.productService.update(id, data);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id') id: string) {
    return !!(await this.productService.delete(id));
  }
}
