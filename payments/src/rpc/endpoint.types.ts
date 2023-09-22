interface IGetLotRes {
  id: number;
  lotName: string;
  sellerId: number;
  sellerName: string;
  quantity: number;
}

export type GetLotRes = IGetLotRes | null;

export interface IGetLotInput {
  lotId: number;
}
