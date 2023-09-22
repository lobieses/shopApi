import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import {
  AuthorizeModifiedInputData,
  IRmqClients,
  RPCResponseType,
} from '../types';
import { SERVICE_NAMES } from '../config/services';
import { RpcException } from '../../common/exceptions/rpc.exception';
import { CONTEXT } from '@nestjs/graphql';
import { Request } from 'express';

interface IRpcHandlerSvc {
  sendMessage: <R, I>(
    service: SERVICE_NAMES,
    pattern: any,
    body?: I,
    attachCredentials?: boolean,
  ) => Observable<R>;

  emitEvent: <I>(services: SERVICE_NAMES[], pattern: any, body?: I) => any;
}

@Injectable({ scope: Scope.REQUEST })
export class RpcHandlerSvc implements IRpcHandlerSvc, OnModuleInit {
  constructor(
    @Inject('SERVICE_CLIENTS')
    private readonly serviceClients: IRmqClients,
    @Inject(CONTEXT) private context: { req: Request; res: Response },
  ) {}

  public sendMessage<R, I>(
    service: SERVICE_NAMES,
    pattern: any,
    body?: I,
    attachCredentials = true,
  ) {
    const payload: AuthorizeModifiedInputData<I> = {
      ...body,
    };

    if (attachCredentials) {
      payload.access_token = this.getAuthorizeToken();
    }

    return this.serviceClients[service]
      .send<RPCResponseType<R>, AuthorizeModifiedInputData<I>>(pattern, payload)
      .pipe(
        catchError((e) => {
          throw new BadRequestException(e);
        }),
        map((res) => {
          if (res && res.hasOwnProperty('error')) {
            throw new RpcException(res.error, res.error.code);
          }

          return res as R;
        }),
      );
  }

  public emitEvent<I>(services: SERVICE_NAMES[], pattern: any, body?: I) {
    services.forEach((service) => {
      this.serviceClients[service].emit<I>(pattern, body);
    });
  }

  private getAuthorizeToken(): string | null {
    let access_token: string | null =
      this.context.req.headers?.authorization || null;

    if (access_token) {
      access_token = access_token.split(' ')[1];
    }

    return access_token;
  }

  public async onModuleInit() {
    const clientsConnections = Object.keys(this.serviceClients).map(
      (serviceName) => this.serviceClients[serviceName].connect(),
    );

    try {
      await Promise.all(clientsConnections);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
