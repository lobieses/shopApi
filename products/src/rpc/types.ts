import { ClientProxy } from '@nestjs/microservices';
import { IServiceExceptionPayload } from '../common/exception-filters/types';

export interface IRmqClients {
  [key: string]: ClientProxy;
}

export interface IErrorResponse {
  error?: IServiceExceptionPayload;
}

export type RPCResponseType<R> = R & IErrorResponse;

export type AuthorizeModifiedInputData<T> = T & {
  access_token?: string | null;
};
