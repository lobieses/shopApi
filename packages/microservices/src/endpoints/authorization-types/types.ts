// ======================== COMMON ===========================

export interface IAccessToken {
  access_token: string;
}

export interface IRefreshToken {
  refresh_token: string;
}

export interface ITokenPayload {
  id: number;
  name: string;
  kind: Kinds;
}

export interface ITokens extends IAccessToken, IRefreshToken {}

export enum Kinds {
  salesman = 'salesman',
  buyer = 'buyer',
}

// ======================== MESSAGES ===========================

// auth.sign-up
export interface ISignUpReq {
  name: string;
  password: string;
  kind: Kinds;
}

export interface ISignUpRes extends ITokens {
  refresh_expire_in_milliseconds: number;
}

// auth.sign-in
export interface ISignInReq {
  name: string;
  password: string;
}

export interface ISignInRes extends ITokens {
  refresh_expire_in_milliseconds: number;
}

// auth.logout
export interface ILogoutReq extends IRefreshToken {}

export type LogoutRes = void;

// auth.refresh
export interface IRefreshReq extends IRefreshToken {}

export interface IRefreshRes extends ITokens {
  refresh_expire_in_milliseconds: number;
}

// auth.validate-access
export interface IValidateAccessReq extends IAccessToken {}

export interface IValidateAccessRes extends ITokenPayload {}
