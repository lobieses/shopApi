import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { RpcModule } from './rpc/rpc.module';
import { SERVICES } from './rpc/config/services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
    PrismaModule,
    RpcModule.forRoot(SERVICES),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
