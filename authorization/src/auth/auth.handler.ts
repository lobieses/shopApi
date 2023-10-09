import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { HashService } from './services/hash.service';
import { ILogoutData, IRefreshData, ISignResponse } from './types';
import { signInDto } from './dtos/sign-in.dto';
import {
  JWTService,
  REFRESH_EXPIRE_IN_MILLISECONDS,
} from '../jwt/services/jwt.service';
import { signUpDto } from './dtos/sign-up.dto';
import { Kinds } from '@shop-api/microservices/authorization-types';

interface IAuthHandler {
  signUp: (data: signUpDto) => Promise<ISignResponse>;
  signIn: (data: signInDto) => Promise<ISignResponse>;
  logout: (data: ILogoutData) => Promise<void>;
  refresh: (data: IRefreshData) => Promise<ISignResponse>;
}

@Injectable()
export class AuthHandler implements IAuthHandler {
  constructor(
    private readonly userService: UserService,
    private readonly hashedService: HashService,
    private readonly jwtService: JWTService,
  ) {}

  public async signUp(data: signUpDto) {
    const { name, password, kind } = data;

    const hashedPassword: string = await this.hashedService.hashPassword(
      password,
    );

    const createUser = await this.userService.createUser(
      name,
      hashedPassword,
      kind,
    );

    const { access_token, refresh_token } = this.jwtService.generateTokens({
      id: createUser.id,
      name,
      kind,
    });

    await this.jwtService.saveRefreshToken(createUser.id, refresh_token);

    return {
      access_token,
      refresh_token,
      refresh_expire_in_milliseconds: REFRESH_EXPIRE_IN_MILLISECONDS,
    };
  }

  public async signIn(data: signInDto) {
    const { name, password } = data;

    const existingUser = await this.userService.getUser(name);
    if (!existingUser) throw new BadRequestException('User not found');

    const isPasswordRight = await this.hashedService.comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordRight) throw new BadRequestException('Invalid password');

    const { access_token, refresh_token } = this.jwtService.generateTokens({
      id: existingUser.id,
      name,
      kind: existingUser.kind as Kinds,
    });

    await this.jwtService.saveRefreshToken(existingUser.id, refresh_token);

    return {
      access_token,
      refresh_token,
      refresh_expire_in_milliseconds: REFRESH_EXPIRE_IN_MILLISECONDS,
    };
  }

  public async logout(data: ILogoutData) {
    const { id } = data.user;

    await this.jwtService.saveRefreshToken(id, null);
  }

  public async refresh(data: IRefreshData) {
    const { id, name } = data.user;

    const user = await this.userService.getUser(name);

    const { access_token, refresh_token } = this.jwtService.generateTokens({
      id,
      name,
      kind: user.kind as Kinds,
    });

    await this.jwtService.saveRefreshToken(id, refresh_token);

    return {
      access_token,
      refresh_token,
      refresh_expire_in_milliseconds: REFRESH_EXPIRE_IN_MILLISECONDS,
    };
  }
}
