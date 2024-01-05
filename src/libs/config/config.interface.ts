export enum Environment {
  Development = 'development',
  Stage = 'stage',
  Production = 'production',
}
export interface RedisConfigVariables {
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}

export interface CsvParserConfigVariables {
  CSV_URL: string;
  BATCH_SIZE: number;
}

export interface ConfigVariables
  extends CsvParserConfigVariables,
    RedisConfigVariables,
    Pick<NodeJS.ProcessEnv, 'npm_package_version' | 'TZ'> {
  NODE_ENV: Environment;
  APP_PORT: number;
  LOG_LEVEL: string;
}
