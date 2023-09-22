import { Injectable } from '@nestjs/common';
import { PutUpLotDto } from './dtos/put-up-lot.dto';
import { ProductsService } from './services/products.service';
import { GetLotsListDto } from './dtos/get-lots-list.dto';
import { ILotResponse } from './transformer/output.types';
import { ProductsTransformerService } from './transformer/product.transformer';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { ILotCreatedEventPayload } from './types';
import { GetLotDto } from './dtos/get-lot.dto';

interface IProductsHandler {
  getLotsList: (data: GetLotsListDto) => Promise<ILotResponse[]>;
  getLot: (data: GetLotDto) => Promise<ILotResponse | null>;
  createLot: (data: PutUpLotDto) => Promise<ILotResponse>;
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
      quantity,
    } = data;

    const createdLot = await this.productsService.createLot(
      sellerId,
      sellerName,
      lotName,
      quantity,
    );

    this.rpcHandlerSvc.emitEvent<ILotCreatedEventPayload>(
      [SERVICE_NAMES.PAYMENTS],
      'payments.event.lot-created',
      { lotId: createdLot.id, lotName: createdLot.lotName, costInUsd: 1 },
    );

    return this.productsTransformerService.toLot(createdLot);
  }
}
