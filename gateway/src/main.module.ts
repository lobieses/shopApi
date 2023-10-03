import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { RpcModule } from './rpc/rpc.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { SERVICES } from './rpc/config/services';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { GraphqlModuleOptions } from './common/configs/graphql.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(GraphqlModuleOptions),
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
