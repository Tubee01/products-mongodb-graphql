import { Field, InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@InputType()
export class CreateProductInput implements Omit<Prisma.ProductCreateInput, 'id' | 'producer'> {
  @Field()
  name!: string;

  @Field()
  vintage!: string;

  @Field()
  producerId!: string;
}
