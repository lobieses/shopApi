import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Kinds } from '@shop-api/microservices/authorization-types';

@Injectable()
export class SalesmanGuard implements CanActivate {
  public canActivate(context: ExecutionContext) {
    const data = context.switchToHttp().getRequest();

    const userKind = data?.user?.kind;

    if (userKind !== Kinds.salesman)
      throw new ForbiddenException('user is not a salesman');

    return true;
  }
}
