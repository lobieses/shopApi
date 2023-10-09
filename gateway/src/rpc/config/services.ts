import { IServiceConfig } from '@shop-api/microservices/rpc';

export enum SERVICE_NAMES {
  AUTHORIZATION = 'AUTHORIZATION',
  PRODUCTS = 'PRODUCTS',
  PAYMENTS = 'PAYMENTS',
}

export const SERVICES: IServiceConfig[] = [
  {
    name: SERVICE_NAMES.AUTHORIZATION,
    queue: {
      name: 'authorization',
    },
    connection_name: 'gateway-auth',
  },
  {
    name: SERVICE_NAMES.PRODUCTS,
    queue: {
      name: 'products',
    },
    connection_name: 'gateway-products',
  },
  {
    name: SERVICE_NAMES.PAYMENTS,
    queue: {
      name: 'payments',
    },
    connection_name: 'gateway-payments',
  },
];
