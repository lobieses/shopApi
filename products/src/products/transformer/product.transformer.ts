import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { ILotResponse } from './output.types';

interface IProductsTransformerService {
  toLotsList: (data: Products[]) => ILotResponse[];
  toLot: (data: Products) => ILotResponse;
}

@Injectable()
export class ProductsTransformerService implements IProductsTransformerService {
  public toLotsList(data: Products[]) {
    return data.map<ILotResponse>(
      ({ id, lotName, sellerId, sellerName, quantity, cost }) => ({
        id,
        lotName,
        sellerId,
        sellerName,
        cost: cost.toNumber(),
        quantity,
      }),
    );
  }

  public toLot(data: Products) {
    const { id, lotName, sellerId, sellerName, cost, quantity } = data;

    return {
      id,
      lotName,
      sellerId,
      sellerName,
      cost: cost.toNumber(),
      quantity,
    } as ILotResponse;
  }
}
