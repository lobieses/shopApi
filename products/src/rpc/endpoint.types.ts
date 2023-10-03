import { IAccessToken, ITokenPayload } from '../common/types';

// ======================================================== Authorization ========================================================
export interface IValidateAccessRes extends ITokenPayload {}

export interface IValidateAccessReq extends IAccessToken {}

// ======================================================== Payments ============================================================
export interface ILotCreatedEventReq {
  lotId: number;
  lotName: string;
  costInUsd: string;
}
