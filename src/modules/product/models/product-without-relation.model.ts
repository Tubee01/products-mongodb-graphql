import { ObjectType, OmitType } from '@nestjs/graphql';
import { Product } from './product.model';

@ObjectType()
export class ProductWithoutRelation extends OmitType(Product, ['producer']) {}
