import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RefreshTokenExistsGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const { refresh_token } = request.cookies;

    if (!refresh_token) new UnauthorizedException();

    return true;
  }
}
