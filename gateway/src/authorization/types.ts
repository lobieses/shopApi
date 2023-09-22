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

export interface ISignUpReq {
  name: string;
  password: string;
  kind: Kinds;
}

export interface ISignInReq {
  name: string;
  password: string;
}

export interface ISignResponse extends ITokens {
  refresh_expire_in_milliseconds: number;
}
