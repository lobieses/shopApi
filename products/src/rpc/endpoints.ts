export const ENDPOINTS = {
  MESSAGES: {
    AUTHORIZATION: {
      VALIDATE_ACCESS: 'auth.validate-access',
    },
    PRODUCTS: {
      CHANGE_QUANTITY: 'products.change-quantity',
      GET_LOT: 'products.get-lot',
      PUT_UP_LOT: 'products.put-up-lot',
      GET_LOTS_LIST: 'products.get-lots-list',
    },
  },
  EVENTS: {
    PAYMENTS: {
      LOT_CREATED: 'payments.event.lot-created',
    },
  },
};
