// ======================== COMMON ===========================
export interface ILot {
  id: number;
  lotName: string;
  sellerId: number;
  sellerName: string;
  cost: number;
  quantity: number;
}

// ======================== MESSAGES ===========================

// products.put-up-lot
export interface IPutUpLotReq {
  lotName: string;
  cost: string;
  quantity: number;
}

export interface IPutUpLotRes extends ILot {}

// products.get-lot
export interface IGetLotReq {
  lotId: number;
}

export interface IGetLotRes extends ILot {}

// products.get-lots-list
export interface IGetLotListReq {
  sellerId?: number | null;
}

export type GetLotListRes = ILot[];

// products.change-quantity
export interface IChangeQuantityReq {
  lotId: number;
  changeNum: number;
}

export interface IChangeQuantityRes {
  id: number;
  lotName: string;
  sellerId: number;
  sellerName: string;
  cost: number;
  quantity: number;
}
