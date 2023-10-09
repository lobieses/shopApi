import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RpcModule } from '@shop-api/microservices/rpc';
import { Config } from './rpc/config';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';
import { rootConfig } from './stripe/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RpcModule.forRoot({
      RMQ_URL: process.env.RMQ_URL,
      services: Config,
      isGlobal: true,
    }),
    StripeModule.forRoot(rootConfig),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
