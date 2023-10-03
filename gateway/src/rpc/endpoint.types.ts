import {
  IAccessToken,
  IRefreshToken,
  ITokenPayload,
  ITokens,
} from '../authorization/types';
import {
  GeLotsListInput,
  GetPaymentCheckoutSessionInput,
  Kinds,
  Lot,
  PutUpLotInput,
} from '../graphql';

// ======================================================== Authorization ========================================================

export interface ISignUpReq {
  name: string;
  password: string;
  kind: Kinds;
}

export interface ISignInReq {
  name: string;
  password: string;
}

export interface ILogoutReq extends IRefreshToken {}

export interface IRefreshReq extends IRefreshToken {}

export interface ISignResponse extends ITokens {
  refresh_expire_in_milliseconds: number;
}

export interface IValidateAccessRes extends ITokenPayload {}

export interface IValidateAccessReq extends IAccessToken {}

// ======================================================== Products ============================================================
export type PutUpLotRes = Lot;

export interface IPutUpLotReq extends PutUpLotInput {}

export type GetLotListRes = Lot[];

export interface IGetLotListReq extends GeLotsListInput {}

// ======================================================== Payments ============================================================
export interface IExpiredSessionEventReq {
  lotId: string;
  quantity: string;
}

export interface ISuccessPaymentEventReq {
  lotId: string;
  quantity: string;
  buyerId: string;
  sellerId: string;
  totalAmount: string;
}

export type GetCheckoutSessionReq = GetPaymentCheckoutSessionInput;

export type GetProductSessionRes = string;
