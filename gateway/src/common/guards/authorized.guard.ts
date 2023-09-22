import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { RpcHandlerSvc } from '../../rpc/services/rpc-handler.service';
import { map, Observable } from 'rxjs';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';
import { IAccessToken, ITokenPayload } from '../../authorization/types';
import { SERVICE_NAMES } from '../../rpc/config/services';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  public canActivate(context: GraphQLExecutionContext): Observable<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;

    const access_token = request.get('authorization');

    if (!access_token) throw new UnauthorizedException();

    return this.rpcHandlerSvc
      .sendMessage<ITokenPayload, IAccessToken>(
        SERVICE_NAMES.AUTHORIZATION,
        'validate-access',
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
