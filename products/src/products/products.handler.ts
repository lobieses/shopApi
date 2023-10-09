import { Injectable } from '@nestjs/common';
import { PutUpLotDto } from './dtos/put-up-lot.dto';
import { ProductsService } from './services/products.service';
import { GetLotsListDto } from './dtos/get-lots-list.dto';
import { ProductsTransformerService } from './transformer/product.transformer';
import { RpcHandlerSvc } from '@shop-api/microservices/rpc';
import { SERVICE_NAMES } from '../rpc/config';
import { GetLotDto } from './dtos/get-lot.dto';
import { ChangeQuantityDto } from './dtos/change-quantity.dto';
import { ENDPOINTS } from '@shop-api/microservices/endpoints';
import { ILotCreatedEventReq } from '@shop-api/microservices/payments-types';
import { ILot } from '@shop-api/microservices/products-types';

interface IProductsHandler {
  getLotsList: (data: GetLotsListDto) => Promise<ILot[]>;
  getLot: (data: GetLotDto) => Promise<ILot | null>;
  createLot: (data: PutUpLotDto) => Promise<ILot>;
  changeQuantity: (data: ChangeQuantityDto) => Promise<ILot>;
}

@Injectable()
export class ProductsHandler implements IProductsHandler {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsTransformerService: ProductsTransformerService,
    private readonly rpcHandlerSvc: RpcHandlerSvc,
  ) {}

  public async getLotsList(data: GetLotsListDto) {
    const { sellerId } = data;

    const findCriteria = { sellerId };

    const products = await this.productsService.getLotsList(findCriteria);

    return this.productsTransformerService.toLotsList(products);
  }

  public async getLot(data: GetLotDto) {
    const lot = await this.productsService.getLot(data.lotId);

    if (!lot) return null;

    return this.productsTransformerService.toLot(lot);
  }

  public async createLot(data: PutUpLotDto) {
    const {
      user: { id: sellerId, name: sellerName },
      lotName,
      cost,
      quantity,
    } = data;

    const createdLot = await this.productsService.createLot(
      sellerId,
      sellerName,
      lotName,
      +cost,
      quantity,
    );

    this.rpcHandlerSvc.emitEvent<ILotCreatedEventReq>(
      [SERVICE_NAMES.PAYMENTS],
      ENDPOINTS.EVENTS.PAYMENTS.LOT_CREATED,
      { lotId: createdLot.id, lotName: createdLot.lotName, costInUsd: cost },
    );

    return this.productsTransformerService.toLot(createdLot);
  }

  public async changeQuantity(data: ChangeQuantityDto) {
    const { lotId, changeNum } = data;

    const updatedLot = await this.productsService.changeLotQuantity(
      lotId,
      changeNum,
    );

    return this.productsTransformerService.toLot(updatedLot);
  }
}
