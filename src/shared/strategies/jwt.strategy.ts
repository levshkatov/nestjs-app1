import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonConfig } from '../../config/interfaces/common';
import { IJWTUser } from '../modules/auth/interfaces/jwt-user.interface';
import { logClassName } from '../helpers/log-classname.helper';
import { Request } from 'express';

function cookieExtractor(req?: Request): JwtFromRequestFunction {
  return function (req?: Request): string | null {
    return req?.signedCookies?.accessToken || null;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<CommonConfig>('common')!.jwt.secret,
      ignoreExpiration: config.get<CommonConfig>('common')!.jwt.ignoreExpiration,
    });
    logClassName(this.constructor.name, __filename);
  }

  async validate(jwtUser: IJWTUser): Promise<IJWTUser> {
    return jwtUser;
  }
}
