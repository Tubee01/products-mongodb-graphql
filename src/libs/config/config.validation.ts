import Joi from 'joi';
import { ConfigVariables, Environment } from './config.interface';

export const ConfigVariablesSchema = Joi.object<ConfigVariables>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),
  TZ: Joi.string().default('UTC'),
  APP_PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().default('debug'),
}).options({
  stripUnknown: true,
  abortEarly: true,
});
