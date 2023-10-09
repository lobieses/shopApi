import { IServiceConfig } from '@shop-api/microservices/rpc';

export enum SERVICE_NAMES {
  AUTHORIZATION = 'AUTHORIZATION',
  PAYMENTS = 'PAYMENTS',
}

export const Config: IServiceConfig[] = [
  {
    name: SERVICE_NAMES.AUTHORIZATION,
    queue: {
      name: 'authorization',
    },
    connection_name: 'products-auth',
  },
  {
    name: SERVICE_NAMES.PAYMENTS,
    queue: {
      name: 'payments',
    },
    connection_name: 'products-payments',
  },
];
