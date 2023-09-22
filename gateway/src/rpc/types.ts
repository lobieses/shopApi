import { ClientProxy } from '@nestjs/microservices';

export interface IRmqClients {
  [key: string]: ClientProxy;
}

export interface IErrorResponse {
  error?: {
    code: number;
    servicesWay: string[];
    description?: any;
  };
}

export type RPCResponseType<R> = R & IErrorResponse;

export type AuthorizeModifiedInputData<T> = T & {
  access_token?: string | null;
};
