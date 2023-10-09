import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Request, Response } from 'express';

interface IRpcAuthorizationService {
  getAccessToken: () => string | null;
}

@Injectable()
export class RpcAuthorizationService implements IRpcAuthorizationService {
  constructor(
    @Inject(CONTEXT) private context: { req: Request; res: Response },
  ) {}

  public getAccessToken(): string | null {
    let access_token: string | null =
      this.context.req.headers?.authorization || null;

    if (access_token) {
      access_token = access_token.split(' ')[1];
    }

    return access_token;
  }
}
