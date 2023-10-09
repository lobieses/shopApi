import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PutUpLotDto } from './dtos/put-up-lot.dto';
import { ProductsHandler } from './products.handler';
import { AuthorizedGuard } from '@shop-api/microservices/common';
import { GetLotsListDto } from './dtos/get-lots-list.dto';
import { SalesmanGuard } from '../common/guards/salesman.guard';
import { GetLotDto } from './dtos/get-lot.dto';
import { ChangeQuantityDto } from './dtos/change-quantity.dto';
import { ENDPOINTS } from '@shop-api/microservices/endpoints';
import {
  GetLotListRes,
  IGetLotRes,
  IPutUpLotRes,
  IChangeQuantityRes,
} from '@shop-api/microservices/products-types';

interface IProductsController {
  getLotsList: (data: GetLotsListDto) => Promise<GetLotListRes>;
  getLot: (data: GetLotDto) => Promise<IGetLotRes | null>;
  putUpLot: (data: PutUpLotDto) => Promise<IPutUpLotRes>;
  changeQuantity: (data: ChangeQuantityDto) => Promise<IChangeQuantityRes>;
}

@Controller('products')
export class ProductsController implements IProductsController {
  constructor(private readonly productsHandler: ProductsHandler) {}

  @MessagePattern(ENDPOINTS.MESSAGES.PRODUCTS.GET_LOTS_LIST)
  public async getLotsList(@Payload() data: GetLotsListDto) {
    return this.productsHandler.getLotsList(data);
  }

  @MessagePattern(ENDPOINTS.MESSAGES.PRODUCTS.GET_LOT)
  public async getLot(@Payload() data: GetLotDto) {
    return this.productsHandler.getLot(data);
  }

  @UseGuards(AuthorizedGuard, SalesmanGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.PRODUCTS.PUT_UP_LOT)
  public async putUpLot(@Payload() data: PutUpLotDto) {
    return this.productsHandler.createLot(data);
  }

  @UseGuards(AuthorizedGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.PRODUCTS.CHANGE_QUANTITY)
  public async changeQuantity(@Payload() data: ChangeQuantityDto) {
    return this.productsHandler.changeQuantity(data);
  }
}
