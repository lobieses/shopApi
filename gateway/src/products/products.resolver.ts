import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GeLotsListInput, PutUpLotInput } from '../graphql';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../rpc/endpoints';
import {
  GetLotListRes,
  IGetLotListReq,
  IPutUpLotReq,
  PutUpLotRes,
} from '../rpc/endpoint.types';

interface IProductsResolver {
  getLotsList: (data: GeLotsListInput) => Observable<GetLotListRes>;
  putUpLot: (data: PutUpLotInput) => Observable<PutUpLotRes>;
}

@Resolver()
export class ProductsResolver implements IProductsResolver {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  @Query()
  public getLotsList(@Args('data') data: GeLotsListInput) {
    return this.rpcHandlerSvc.sendMessage<GetLotListRes, IGetLotListReq>(
      SERVICE_NAMES.PRODUCTS,
      ENDPOINTS.MESSAGES.PRODUCTS.GET_LOTS_LIST,
      data,
      false,
    );
  }

  @Mutation()
  public putUpLot(@Args('data') data: PutUpLotInput) {
    return this.rpcHandlerSvc.sendMessage<PutUpLotRes, IPutUpLotReq>(
      SERVICE_NAMES.PRODUCTS,
      ENDPOINTS.MESSAGES.PRODUCTS.PUT_UP_LOT,
      data,
      true,
    );
  }
}
