import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from './authorization/authorization.module';
import { RpcModule } from '@shop-api/microservices/gateway';
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
    RpcModule.forRoot({
      RMQ_URL: process.env.RMQ_URL,
      services: SERVICES,
      isGlobal: true,
    }),
    ProductsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
