import { IAccessToken, ITokenPayload } from '../common/types';

// ======================================================== Authorization ========================================================
export interface IValidateAccessRes extends ITokenPayload {}

export interface IValidateAccessReq extends IAccessToken {}

// ======================================================== Products ============================================================

export type GetLotRes = IChangeQuantityRes | null;

export interface IGetLotReq {
  lotId: number;
}

export interface IChangeQuantityRes {
  id: number;
  lotName: string;
  sellerId: number;
  sellerName: string;
  cost: number;
  quantity: number;
}

export interface IChangeQuantityReq {
  lotId: number;
  changeNum: number;
}
