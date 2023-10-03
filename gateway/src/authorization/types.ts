import { Kinds } from '../graphql';

export interface ITokenPayload {
  id: number;
  name: string;
  kind: Kinds;
}

export interface IAccessToken {
  access_token: string;
}

export interface IRefreshToken {
  refresh_token: string;
}

export interface ITokens extends IAccessToken, IRefreshToken {}
