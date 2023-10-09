export enum SERVICE_NAMES {
  AUTHORIZATION = 'AUTHORIZATION',
  PRODUCTS = 'PRODUCTS',
  PAYMENTS = 'PAYMENTS',
}

export interface IServiceConfig {
  name: SERVICE_NAMES;
  queue: {
    name: string;
    durable?: string;
  };
  connection_name?: string;
}
