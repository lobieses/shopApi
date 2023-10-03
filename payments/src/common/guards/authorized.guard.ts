import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcHandlerSvc } from '../../rpc/services/rpc-handler.service';
import { map } from 'rxjs';
import { SERVICE_NAMES } from '../../rpc/config/services';
import { ENDPOINTS } from '../../rpc/endpoints';
import {
  IValidateAccessReq,
  IValidateAccessRes,
} from '../../rpc/endpoint.types';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  public canActivate(context: ExecutionContext) {
    const data = context.switchToHttp().getRequest();

    const access_token = data?.access_token;

    if (!access_token) throw new UnauthorizedException();

    return this.rpcHandlerSvc
      .sendMessage<IValidateAccessRes, IValidateAccessReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.VALIDATE_ACCESS,
        {
          access_token,
        },
        true,
      )
      .pipe(
        map((res) => {
          data.user = res;
          return true;
        }),
      );
  }
}
