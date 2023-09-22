import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload, ITokens } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtTokens } from '@prisma/client';

interface IJWTService {
  generateTokens: (payload: ITokenPayload) => ITokens;
  saveRefreshToken: (
    userId: number,
    refresh_token: string,
  ) => Promise<JwtTokens>;
  getRefreshToken: (userId: number) => Promise<JwtTokens>;
}

const ACCESS_TOKEN_EXPIRE = '15m';
const REFRESH_TOKEN_EXPIRE = '7d';
export const REFRESH_EXPIRE_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class JWTService implements IJWTService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  generateTokens(payload: ITokenPayload) {
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });

    return { access_token, refresh_token };
  }

  public async saveRefreshToken(userId: number, refresh_token: string | null) {
    return this.prisma.jwtTokens.upsert({
      where: {
        id: userId,
      },
      create: {
        id: userId,
        refresh_token,
      },
      update: {
        id: userId,
        refresh_token,
      },
    });
  }

  public async getRefreshToken(userId: number) {
    return this.prisma.jwtTokens.findFirst({
      where: {
        id: userId,
      },
    });
  }
}
