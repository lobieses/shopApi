import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthHandler } from './auth.handler';
import { signInDto } from './dtos/sign-in.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ILogoutData, IRefreshData, IValidateAccessData } from './types';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { signUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSvc: AuthHandler) {}

  @MessagePattern('auth.sign-up')
  public async signUp(@Payload() data: signUpDto) {
    return this.authSvc.signUp(data);
  }

  @MessagePattern('sign-in')
  public async signIn(@Payload() data: signInDto) {
    return this.authSvc.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @MessagePattern('logout')
  public async logout(@Payload() data: ILogoutData) {
    await this.authSvc.logout(data);
  }

  @UseGuards(RefreshTokenGuard)
  @MessagePattern('refresh')
  public async refresh(@Payload() data: IRefreshData) {
    return this.authSvc.refresh(data);
  }

  @UseGuards(AccessTokenGuard)
  @MessagePattern('validate-access')
  public async validateAccess(@Payload() data: IValidateAccessData) {
    return data.user;
  }
}
