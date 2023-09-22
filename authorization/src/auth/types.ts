import {
  IAccessToken,
  IRefreshToken,
  ITokenPayload,
  ITokens,
} from '../jwt/types';

export interface ISignResponse extends ITokens {
  refresh_expire_in_milliseconds: number;
}

interface IPassportPayload {
  user: ITokenPayload;
}

export interface IValidateAccessData extends IAccessToken, IPassportPayload {}

export interface ILogoutData extends IRefreshToken, IPassportPayload {}

export interface IRefreshData extends IRefreshToken, IPassportPayload {}
