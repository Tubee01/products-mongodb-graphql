import Joi from 'joi';
import { ConfigVariables, Environment } from './config.interface';

export const ConfigVariablesSchema = Joi.object<ConfigVariables>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),
  TZ: Joi.string().default('UTC'),
  APP_PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().default(''),
  CSV_URL: Joi.string().required(),
  BATCH_SIZE: Joi.number().default(100),
  GRAPHQL_SCHEMA_FILE: Joi.string().default('schema.graphql'),
}).options({
  stripUnknown: true,
  abortEarly: true,
});
