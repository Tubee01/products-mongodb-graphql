export enum Environment {
  Development = 'development',
  Stage = 'stage',
  Production = 'production',
}

export interface ConfigVariables extends Pick<NodeJS.ProcessEnv, 'npm_package_version' | 'TZ'> {
  NODE_ENV: Environment;
  APP_PORT: number;
  LOG_LEVEL: string;
}
