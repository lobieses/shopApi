import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { ILot } from '@shop-api/microservices/products-types';

interface IProductsTransformerService {
  toLotsList: (data: Products[]) => ILot[];
  toLot: (data: Products) => ILot;
}

@Injectable()
export class ProductsTransformerService implements IProductsTransformerService {
  public toLotsList(data: Products[]) {
    return data.map<ILot>(
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
    } as ILot;
  }
}
