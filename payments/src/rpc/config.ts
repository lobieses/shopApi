import { IServiceConfig } from '@shop-api/microservices/rpc';

export enum SERVICE_NAMES {
  AUTHORIZATION = 'AUTHORIZATION',
  PRODUCTS = 'PRODUCTS',
}

export const Config: IServiceConfig[] = [
  {
    name: SERVICE_NAMES.AUTHORIZATION,
    queue: {
      name: 'authorization',
    },
    connection_name: 'payments-auth',
  },
  {
    name: SERVICE_NAMES.PRODUCTS,
    queue: {
      name: 'products',
    },
    connection_name: 'payments-products',
  },
];
