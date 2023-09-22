import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GeLotsListInput, Lot, PutUpLotInput } from '../graphql';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { Observable } from 'rxjs';

interface IProductsResolver {
  getLotsList: (data: GeLotsListInput) => Observable<Lot[]>;
  putUpLot: (data: PutUpLotInput) => Observable<Lot>;
}

@Resolver()
export class ProductsResolver implements IProductsResolver {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  @Query()
  public getLotsList(@Args('data') data: GeLotsListInput) {
    return this.rpcHandlerSvc.sendMessage<Lot[], GeLotsListInput>(
      SERVICE_NAMES.PRODUCTS,
      'products.get-lots-list',
      data,
      false,
    );
  }

  @Mutation()
  public putUpLot(@Args('data') data: PutUpLotInput) {
    return this.rpcHandlerSvc.sendMessage<Lot, PutUpLotInput>(
      SERVICE_NAMES.PRODUCTS,
      'products.put-up-lot',
      data,
      true,
    );
  }
}
