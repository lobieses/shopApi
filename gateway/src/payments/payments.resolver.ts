import { Args, Query, Resolver } from '@nestjs/graphql';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { GetPaymentCheckoutSessionInput } from '../graphql';
import { Observable } from 'rxjs';
import {
  GetCheckoutSessionReq,
  GetProductSessionRes,
} from '../rpc/endpoint.types';
import { ENDPOINTS } from '../rpc/endpoints';

interface IPaymentsResolver {
  getPaymentCheckoutSession: (
    data: GetPaymentCheckoutSessionInput,
  ) => Observable<GetProductSessionRes>;
}

@Resolver()
export class PaymentsResolver implements IPaymentsResolver {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  @Query()
  public getPaymentCheckoutSession(
    @Args('data') data: GetPaymentCheckoutSessionInput,
  ) {
    return this.rpcHandlerSvc.sendMessage<
      GetProductSessionRes,
      GetCheckoutSessionReq
    >(
      SERVICE_NAMES.PAYMENTS,
      ENDPOINTS.MESSAGES.PAYMENTS.GET_PRODUCT_PAYMENT_SESSION,
      data,
    );
  }
}
