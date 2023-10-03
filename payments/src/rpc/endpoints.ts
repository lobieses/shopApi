export const ENDPOINTS = {
  MESSAGES: {
    AUTHORIZATION: {
      VALIDATE_ACCESS: 'auth.validate-access',
    },
    PAYMENTS: {
      GET_PRODUCT_PAYMENT_SESSION: 'payments.get-product-payment-session',
    },
    PRODUCTS: {
      CHANGE_QUANTITY: 'products.change-quantity',
      GET_LOT: 'products.get-lot',
    },
  },
  EVENTS: {
    PAYMENTS: {
      SUCCESS_PAYMENT: 'payments.event.success-payment',
      EXPIRED_SESSION: 'payments.event.expired-session',
      LOT_CREATED: 'payments.event.lot-created',
    },
  },
};
