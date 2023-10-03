import { Injectable } from '@nestjs/common';
import { PutUpLotDto } from './dtos/put-up-lot.dto';
import { ProductsService } from './services/products.service';
import { GetLotsListDto } from './dtos/get-lots-list.dto';
import { ILotResponse } from './transformer/output.types';
import { ProductsTransformerService } from './transformer/product.transformer';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { GetLotDto } from './dtos/get-lot.dto';
import { ChangeQuantityDto } from './dtos/change-quantity.dto';
import { ENDPOINTS } from '../rpc/endpoints';
import { ILotCreatedEventReq } from '../rpc/endpoint.types';

interface IProductsHandler {
  getLotsList: (data: GetLotsListDto) => Promise<ILotResponse[]>;
  getLot: (data: GetLotDto) => Promise<ILotResponse | null>;
  createLot: (data: PutUpLotDto) => Promise<ILotResponse>;
  changeQuantity: (data: ChangeQuantityDto) => Promise<ILotResponse>;
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
