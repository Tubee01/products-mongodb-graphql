import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@libs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('APP_PORT'));
  app.getUrl().then((url) => {
    logger.log(`Listening at ${url}`);
  });
}
bootstrap();
