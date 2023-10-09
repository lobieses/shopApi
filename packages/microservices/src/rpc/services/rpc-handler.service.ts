import { HttpException, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthorizeModifiedInputData, RPCResponseType } from '../types';
import { RpcBrokerService } from './rpc-services-broker.service';
import { RpcAuthorizationService } from './rpc-authorization.service';

interface IRpcHandlerSvc {
  sendMessage: <R, I>(
    service: string,
    pattern: any,
    body?: I,
    attachCredentials?: boolean,
  ) => Observable<R>;

  emitEvent: <I>(services: string[], pattern: any, body?: I) => any;
}

@Injectable()
export class RpcHandlerSvc implements IRpcHandlerSvc {
  constructor(
    private readonly rpcAuthorizationService: RpcAuthorizationService,
    private readonly rpcBrokerService: RpcBrokerService,
  ) {}

  public sendMessage<R, I>(
    service: string,
    pattern: any,
    body?: I,
    attachCredentials = true,
  ) {
    const payload: AuthorizeModifiedInputData<I> = { ...body };

    if (attachCredentials) {
      payload.access_token = this.rpcAuthorizationService.getAccessToken();
    }

    const client = this.rpcBrokerService.getClient(service);

    return client
      .send<RPCResponseType<R>, AuthorizeModifiedInputData<I>>(pattern, payload)
      .pipe(
        map((res) => {
          if (res && res.hasOwnProperty('error')) {
            throw new HttpException(res.error, res.error.code);
          }

          return res as R;
        }),
      );
  }

  public emitEvent<I>(services: string[], pattern: any, body?: I) {
    const clients = this.rpcBrokerService.getArrayOfClients(services);

    clients.forEach((client) => {
      client.emit<I>(pattern, body);
    });
  }
}
