import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { Config } from './rpc/config';
import { ConfigModule } from '@nestjs/config';
import { RpcModule } from '@shop-api/microservices/rpc';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    PrismaModule,
    RpcModule.forRoot({
      RMQ_URL: process.env.RMQ_URL,
      services: Config,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
