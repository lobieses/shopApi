import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { RpcHandlerSvc } from '../../rpc/services/rpc-handler.service';
import { map, Observable } from 'rxjs';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { SERVICE_NAMES } from '../../rpc/config/services';
import { ENDPOINTS } from '../../rpc/endpoints';
import {
  IValidateAccessReq,
  IValidateAccessRes,
} from '../../rpc/endpoint.types';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  public canActivate(context: GraphQLExecutionContext): Observable<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;

    const access_token = request.get('authorization');

    if (!access_token) throw new UnauthorizedException();

    return this.rpcHandlerSvc
      .sendMessage<IValidateAccessRes, IValidateAccessReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.VALIDATE_ACCESS,
        {
          access_token: access_token.split(' ')[1],
        },
      )
      .pipe(
        map((res) => {
          request.user = res;
          return true;
        }),
      );
  }
}
