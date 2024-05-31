import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { Request as RequestType } from 'express';
import { AUTH_COOKIE } from '../../utils/auth.constant';
import { OrNeverType } from 'src/utils/types/or-never.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  // Set Auth cookie
  // private static extractJWT(req: RequestType): string | null {
  //   const token = req?.cookies[AUTH_COOKIE.TOKEN];
  //   console.log(AUTH_COOKIE.TOKEN, token);
  //   if (!token) {
  //     return null;
  //   }
  //   return token;
  // }

  // public validate(payload: JwtPayloadType): JwtPayloadType {
  //   if (!payload.id) {
  //     throw new UnauthorizedException();
  //   }

  //   return payload;
  // }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
