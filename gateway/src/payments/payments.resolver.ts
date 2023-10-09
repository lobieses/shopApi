import { Args, Query, Resolver } from '@nestjs/graphql';
import { RpcHandlerSvc } from '@shop-api/microservices/gateway';
import { SERVICE_NAMES } from '../rpc/config/services';
import { GetPaymentCheckoutSessionInput } from '../graphql';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '@shop-api/microservices/endpoints';
import {
  GetPaymentCheckoutSessionRes,
  IGetPaymentCheckoutSessionReq,
} from '@shop-api/microservices/payments-types';

interface IPaymentsResolver {
  getPaymentCheckoutSession: (
    data: GetPaymentCheckoutSessionInput,
  ) => Observable<GetPaymentCheckoutSessionRes>;
}

@Resolver()
export class PaymentsResolver implements IPaymentsResolver {
  constructor(private readonly rpcHandlerSvc: RpcHandlerSvc) {}

  @Query()
  public getPaymentCheckoutSession(
    @Args('data') data: GetPaymentCheckoutSessionInput,
  ) {
    return this.rpcHandlerSvc.sendMessage<
      GetPaymentCheckoutSessionRes,
      IGetPaymentCheckoutSessionReq
    >(
      SERVICE_NAMES.PAYMENTS,
      ENDPOINTS.MESSAGES.PAYMENTS.GET_PRODUCT_PAYMENT_SESSION,
      data,
    );
  }
}
