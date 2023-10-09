// ======================== MESSAGES ===========================

// payments.get-product-payment-session
export interface IGetPaymentCheckoutSessionReq {
  lotId: number;
  quantity: number;
}

export type GetPaymentCheckoutSessionRes = string;

// ======================== EVENTS ===========================

// payments.event.success-payment
export interface ISuccessPaymentEventReq {
  lotId: string;
  quantity: string;
  buyerId: string;
  sellerId: string;
  totalAmount: string;
}

// payments.event.expired-session
export interface IExpiredSessionEventReq {
  lotId: string;
  quantity: string;
}

// payments.event.lot-created
export interface ILotCreatedEventReq {
  lotId: number;
  lotName: string;
  costInUsd: string;
}
