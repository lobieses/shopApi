import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthHandler } from './auth.handler';
import { signInDto } from './dtos/sign-in.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ILogoutData, IRefreshData, IValidateAccessData } from './types';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { signUpDto } from './dtos/sign-up.dto';
import { ENDPOINTS } from '@shop-api/microservices/endpoints';
import {
  ITokens,
  ITokenPayload,
} from '@shop-api/microservices/authorization-types';

interface IAuthController {
  signUp: (data: signUpDto) => Promise<ITokens>;
  signIn: (data: signInDto) => Promise<ITokens>;
  logout: (data: ILogoutData) => Promise<void>;
  refresh: (data: IRefreshData) => Promise<ITokens>;
  validateAccess: (data: IValidateAccessData) => Promise<ITokenPayload>;
}

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authSvc: AuthHandler) {}

  @MessagePattern(ENDPOINTS.MESSAGES.AUTHORIZATION.SIGN_UP)
  public async signUp(@Payload() data: signUpDto) {
    return this.authSvc.signUp(data);
  }

  @MessagePattern(ENDPOINTS.MESSAGES.AUTHORIZATION.SIGN_IN)
  public async signIn(@Payload() data: signInDto) {
    return this.authSvc.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.AUTHORIZATION.LOGOUT)
  public async logout(@Payload() data: ILogoutData) {
    await this.authSvc.logout(data);
  }

  @UseGuards(RefreshTokenGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.AUTHORIZATION.REFRESH)
  public async refresh(@Payload() data: IRefreshData) {
    return this.authSvc.refresh(data);
  }

  @UseGuards(AccessTokenGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.AUTHORIZATION.VALIDATE_ACCESS)
  public async validateAccess(@Payload() data: IValidateAccessData) {
    return data.user;
  }
}
