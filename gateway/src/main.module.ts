import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { RpcModule } from './rpc/rpc.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SERVICES } from './rpc/config/services';
import { ProductsModule } from './products/products.module';
import { GraphQLFormattedError } from 'graphql/error';
import { IFormattedGraphqlExceptionPayload } from './common/exception-filters/types';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      context: ({ req, res }) => ({ req, res }),
      formatError: (
        error: GraphQLFormattedError & {
          extensions: IFormattedGraphqlExceptionPayload;
        },
      ) => {
        const message = error.message;
        const extensions = error.extensions;

        const errorData: GraphQLFormattedError = {
          message: message,
          extensions: {
            code_name: extensions.code_name,
            status_code: extensions.status_code || extensions.code,
            explain: extensions.description,
            stacktrace:
              extensions.exception_stacktrace || extensions.stacktrace,
          },
        };
        return errorData;
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthorizationModule,
    RpcModule.forRoot(SERVICES),
    ProductsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
