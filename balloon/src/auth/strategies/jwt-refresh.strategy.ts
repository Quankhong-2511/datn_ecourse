import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { AllConfigType } from 'src/config/config.type';
import { Request as RequestType } from 'express';
import { AUTH_COOKIE } from '../../utils/auth.constant';
import { OrNeverType } from 'src/utils/types/or-never.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
    });
  }

  // Set auth cookie
  // private static extractJWT(req: RequestType): string | null {
  //   const refreshToken = req?.cookies[AUTH_COOKIE.REFRESH_TOKEN];
  //   if (!refreshToken) {
  //     return null;
  //   }
  //   return refreshToken;
  // }

  // public validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType {
  //   if (!payload.sessionId) {
  //     throw new UnauthorizedException();
  //   }

  //   return payload;
  // }

  public validate(payload: JwtRefreshPayloadType): OrNeverType<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
