import { UserKind } from '@prisma/client';

export interface IAccessToken {
  access_token: string;
}

export interface IRefreshToken {
  refresh_token: string;
}

export interface ITokens extends IAccessToken, IRefreshToken {}

export interface ITokenPayload {
  id: number;
  name: string;
  kind: UserKind;
}
