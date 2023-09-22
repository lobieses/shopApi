import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsHandler } from './products.handler';
import { ProductsService } from './services/products.service';
import { ProductsTransformerService } from './transformer/product.transformer';

@Module({
  providers: [ProductsHandler, ProductsService, ProductsTransformerService],
  controllers: [ProductsController],
})
export class ProductsModule {}
