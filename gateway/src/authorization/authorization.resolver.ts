import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignInInput, SignUpInput } from '../graphql';
import { finalize, map, Observable } from 'rxjs';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import { RpcHandlerSvc } from '@shop-api/microservices/gateway';
import { IGraphQLContext } from '../common/types';
import { SERVICE_NAMES } from '../rpc/config/services';
import { ENDPOINTS } from '@shop-api/microservices/endpoints';
import {
  ISignUpReq,
  ISignUpRes,
  ISignInReq,
  ISignInRes,
  ILogoutReq,
  LogoutRes,
  IRefreshReq,
  IRefreshRes,
  IAccessToken,
} from '@shop-api/microservices/authorization-types';

interface IAuthorizationResolver {
  signUp: (
    data: SignUpInput,
    context: IGraphQLContext,
  ) => Observable<IAccessToken>;

  signIn: (
    data: SignInInput,
    context: IGraphQLContext,
  ) => Observable<IAccessToken>;

  logout: (context: IGraphQLContext) => Observable<void>;

  refresh: (context: IGraphQLContext) => Observable<IAccessToken>;
}

@Resolver()
export class AuthorizationResolver implements IAuthorizationResolver {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  @Mutation()
  public signUp(
    @Args('data') data: SignUpInput,
    @Context() context: IGraphQLContext,
  ) {
    return this.rpcHandlerSvc
      .sendMessage<ISignUpRes, ISignUpReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.SIGN_UP,
        data,
      )
      .pipe(
        map(
          ({ access_token, refresh_token, refresh_expire_in_milliseconds }) => {
            context.res.cookie(REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
              maxAge: refresh_expire_in_milliseconds,
              httpOnly: true,
            });

            return { access_token };
          },
        ),
      );
  }

  @Query()
  public signIn(
    @Args('data') data: SignInInput,
    @Context() context: IGraphQLContext,
  ) {
    return this.rpcHandlerSvc
      .sendMessage<ISignInRes, ISignInReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.SIGN_IN,
        data,
      )
      .pipe(
        map(
          ({ access_token, refresh_token, refresh_expire_in_milliseconds }) => {
            context.res.cookie(REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
              maxAge: refresh_expire_in_milliseconds,
              httpOnly: true,
            });

            return { access_token };
          },
        ),
      );
  }

  @Query()
  public logout(@Context() context: IGraphQLContext) {
    const { refresh_token } = context.req.cookies;

    return this.rpcHandlerSvc
      .sendMessage<LogoutRes, ILogoutReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.LOGOUT,
        {
          refresh_token,
        },
      )
      .pipe(finalize(() => context.res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)));
  }

  @Query()
  public refresh(@Context() context: IGraphQLContext) {
    const { refresh_token } = context.req.cookies;

    return this.rpcHandlerSvc
      .sendMessage<IRefreshRes, IRefreshReq>(
        SERVICE_NAMES.AUTHORIZATION,
        ENDPOINTS.MESSAGES.AUTHORIZATION.REFRESH,
        {
          refresh_token,
        },
      )
      .pipe(
        map(
          ({ access_token, refresh_token, refresh_expire_in_milliseconds }) => {
            context.res.cookie(REFRESH_TOKEN_COOKIE_NAME, refresh_token, {
              maxAge: refresh_expire_in_milliseconds,
              httpOnly: true,
            });

            return { access_token };
          },
        ),
      );
  }
}
