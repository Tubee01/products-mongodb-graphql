import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Producer as PrismaProducer } from '@prisma/client';
import { Product } from '../../product/models/product.model';

@ObjectType()
export class Producer implements PrismaProducer {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field()
  region: string;

  @Field(() => [Product])
  products: Product[];
}
