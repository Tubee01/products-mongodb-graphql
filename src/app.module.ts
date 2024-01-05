import { ConfigModule, ConfigService, Environment } from '@libs/config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { SyncModule } from './modules/sync/sync.module';
import { CsvReaderService } from './modules/sync/csv-reader.service';

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
    SyncModule,
  ],
  providers: [CsvReaderService],
})
export class AppModule {}
