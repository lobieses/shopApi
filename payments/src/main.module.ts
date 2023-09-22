import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RpcModule } from './rpc/rpc.module';
import { SERVICES } from './rpc/config/services';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    RpcModule.forRoot(SERVICES),
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRoot({ apiVersion: '2023-08-16' }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
