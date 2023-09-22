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
      ({ id, lotName, sellerId, sellerName, quantity }) => ({
        id,
        lotName,
        sellerId,
        sellerName,
        quantity,
      }),
    );
  }

  public toLot(data: Products) {
    const { id, lotName, sellerId, sellerName, quantity } = data;

    return {
      id,
      lotName,
      sellerId,
      sellerName,
      quantity,
    } as ILotResponse;
  }
}
