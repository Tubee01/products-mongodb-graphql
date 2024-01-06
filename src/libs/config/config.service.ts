import { Injectable } from '@nestjs/common';
import { ConfigService as ConfigServiceBase } from '@nestjs/config';
import { ConfigVariables } from './config.interface';

@Injectable()
export class ConfigService extends ConfigServiceBase<ConfigVariables> {}
