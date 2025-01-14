import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import validateConfig from 'src/utils/validate-config';
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Min, Max } from 'class-validator';
import { getValueOrDefault } from 'src/utils';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsInt()
  @Min(30)
  @IsOptional()
  SECRET_TIME_TO_LIVE: number;

  @IsString()
  @IsOptional()
  URL_INVITE: string;

  @IsString()
  @IsOptional()
  FONTS_DIRECTORY: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: getValueOrDefault(process.env.APP_PORT ?? process.env.PORT, 3000),
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    ttl: process.env.SECRET_TIME_TO_LIVE ? parseInt(process.env.SECRET_TIME_TO_LIVE, 30) : 30,
    urlInvite: process.env.URL_INVITE || 'login',
    fontsDirectory: process.env.FONTS_DIRECTORY || './src/utils/fonts',
  };
});
