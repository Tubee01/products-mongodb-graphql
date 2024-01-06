import { ConfigModule, ConfigService, Environment } from '@libs/config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { GraphQLModule } from '@nestjs/graphql';
import { SyncModule } from './modules/sync/sync.module';
import { ProductModule } from './modules/product/product.module';
import { ProducerModule } from './modules/producer/producer.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL'),
          transport:
            configService.get('NODE_ENV') === Environment.Development
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                }
              : undefined,
        },
      }),
    }),
    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: configService.get('GRAPHQL_SCHEMA_FILE'),
        playground: configService.get('NODE_ENV') === Environment.Development,
        context: ({ req }) => ({ req }),
      }),
      inject: [ConfigService],
    }),
    SyncModule,
    ProductModule,
    ProducerModule,
  ],
})
export class AppModule {}
