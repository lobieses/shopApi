import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  AuthorizeModifiedInputData,
  IRmqClients,
  RPCResponseType,
} from '../types';
import { SERVICE_NAMES } from '../config/services';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from '@nestjs/microservices';

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
    @Inject(REQUEST) private context: RequestContext,
  ) {}

  public sendMessage<R, I>(
    service: SERVICE_NAMES,
    pattern: any,
    body?: I,
    attachCredentials = true,
  ) {
    const payload: AuthorizeModifiedInputData<I> = { ...body };

    if (attachCredentials) {
      payload.access_token = this.getAuthorizeToken();
    }

    return this.serviceClients[service]
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

  public emitEvent<I>(services: SERVICE_NAMES[], pattern: any, body?: I) {
    services.forEach((service) => {
      this.serviceClients[service].emit<I>(pattern, body);
    });
  }

  private getAuthorizeToken(): string | null {
    const access_token: string | null = this.context.data.access_token || null;

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
