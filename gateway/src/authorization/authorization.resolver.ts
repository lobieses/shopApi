import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignInInput, SignRes, SignUpInput } from '../graphql';
import { finalize, map, Observable } from 'rxjs';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { IGraphQLContext } from '../common/types';
import { SERVICE_NAMES } from '../rpc/config/services';
import {
  ILogoutReq,
  IRefreshReq,
  ISignInReq,
  ISignResponse,
  ISignUpReq,
} from '../rpc/endpoint.types';
import { ENDPOINTS } from '../rpc/endpoints';

interface IAuthorizationResolver {
  signUp: (data: SignUpInput, context: IGraphQLContext) => Observable<SignRes>;

  signIn: (data: SignInInput, context: IGraphQLContext) => Observable<SignRes>;

  logout: (context: IGraphQLContext) => Observable<void>;

  refresh: (context: IGraphQLContext) => Observable<SignRes>;
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
      .sendMessage<ISignResponse, ISignUpReq>(
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
      .sendMessage<ISignResponse, ISignInReq>(
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
      .sendMessage<void, ILogoutReq>(
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
      .sendMessage<ISignResponse, IRefreshReq>(
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
