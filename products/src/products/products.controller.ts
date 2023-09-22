import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PutUpLotDto } from './dtos/put-up-lot.dto';
import { ProductsHandler } from './products.handler';
import { AuthorizedGuard } from '../common/guards/authorized.guard';
import { GetLotsListDto } from './dtos/get-lots-list.dto';
import { ILotResponse } from './transformer/output.types';
import { SalesmanGuard } from '../common/guards/salesman.guard';
import { GetLotDto } from './dtos/get-lot.dto';

interface IProductsController {
  getLotsList: (data: GetLotsListDto) => Promise<ILotResponse[]>;
  getLot: (data: GetLotDto) => Promise<ILotResponse | null>;
  putUpLot: (data: PutUpLotDto) => Promise<ILotResponse>;
}

@Controller('products')
export class ProductsController implements IProductsController {
  constructor(private readonly productsHandler: ProductsHandler) {}

  @MessagePattern('products.get-lots-list')
  public async getLotsList(@Payload() data: GetLotsListDto) {
    return this.productsHandler.getLotsList(data);
  }

  @MessagePattern('products.get-lot')
  public async getLot(@Payload() data: GetLotDto) {
    return this.productsHandler.getLot(data);
  }

  @UseGuards(AuthorizedGuard, SalesmanGuard)
  @MessagePattern('products.put-up-lot')
  public async putUpLot(@Payload() data: PutUpLotDto) {
    return this.productsHandler.createLot(data);
  }
}
