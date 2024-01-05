import { ObjectType, OmitType } from '@nestjs/graphql';
import { Producer } from './producer.model';

@ObjectType()
export class ProducerWithoutRelation extends OmitType(Producer, ['products']) {}
