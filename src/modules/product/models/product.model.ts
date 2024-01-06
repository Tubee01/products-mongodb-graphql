import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product as PrismaProduct } from '@prisma/client';
import { ProducerWithoutRelation } from '../../producer/models/producer-without-relation.model';

@ObjectType()
export class Product implements PrismaProduct {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  vintage: string;

  @Field()
  producerId: string;

  @Field(() => ProducerWithoutRelation)
  producer: ProducerWithoutRelation;
}
