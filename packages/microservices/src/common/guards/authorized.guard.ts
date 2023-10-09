import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcHandlerSvc } from '../../rpc';
import {
  IValidateAccessRes,
  IValidateAccessReq,
} from '../../endpoints/authorization-types';
import { firstValueFrom, map } from 'rxjs';
import { ENDPOINTS } from '../../endpoints';
import { SERVICE_NAMES } from '../../rpc/config/types';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  public canActivate(context: ExecutionContext) {
    const data = context.switchToHttp().getRequest();

    const access_token = data?.access_token;

    if (!access_token) throw new UnauthorizedException();

    return firstValueFrom(
      this.rpcHandlerSvc
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
        ),
    );
  }
}
