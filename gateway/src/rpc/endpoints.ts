export const ENDPOINTS = {
  MESSAGES: {
    AUTHORIZATION: {
      SIGN_UP: 'auth.sign-up',
      SIGN_IN: 'auth.sign-in',
      LOGOUT: 'auth.logout',
      REFRESH: 'auth.refresh',
      VALIDATE_ACCESS: 'auth.validate-access',
    },
    PAYMENTS: {
      GET_PRODUCT_PAYMENT_SESSION: 'payments.get-product-payment-session',
    },
    PRODUCTS: {
      PUT_UP_LOT: 'products.put-up-lot',
      GET_LOTS_LIST: 'products.get-lots-list',
    },
  },
  EVENTS: {
    PAYMENTS: {
      SUCCESS_PAYMENT: 'payments.event.success-payment',
      EXPIRED_SESSION: 'payments.event.expired-session',
    },
  },
};
