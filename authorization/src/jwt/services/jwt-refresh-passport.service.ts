import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IRefreshToken, ITokenPayload } from '../types';
import { JWTService } from './jwt.service';

@Injectable()
export class RefreshTokenPassport extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JWTService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => req.refresh_token,
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  public async validate(req: IRefreshToken, payload: ITokenPayload) {
    const { refresh_token } = req;

    const { refresh_token: saved_refresh_token } =
      await this.jwtService.getRefreshToken(payload.id);

    if (refresh_token !== saved_refresh_token) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
