import { Resolver } from '@nestjs/graphql';
import { Producer } from './models/producer.model';

@Resolver(() => Producer)
export class ProducerResolver {}
