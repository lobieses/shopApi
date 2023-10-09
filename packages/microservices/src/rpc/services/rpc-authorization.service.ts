import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from '@nestjs/microservices';

interface IRpcAuthorizationService {
  getAccessToken: () => string | null;
}

@Injectable()
export class RpcAuthorizationService implements IRpcAuthorizationService {
  constructor(@Inject(REQUEST) private context: RequestContext) {}

  public getAccessToken(): string | null {
    const access_token: string | null = this.context.data.access_token || null;

    return access_token;
  }
}
