import { Args, Query, Resolver } from '@nestjs/graphql';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { GetPaymentCheckoutSessionInput } from '../graphql';
import { Observable } from 'rxjs';
import { GetProductSessionRes } from '../rpc/endpoint.types';

interface IPaymentsResolver {
  getPaymentCheckoutSession: (
    data: GetPaymentCheckoutSessionInput,
  ) => Observable<any>;
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
      GetPaymentCheckoutSessionInput
    >(SERVICE_NAMES.PAYMENTS, 'payments.get-product-payment-session', data);
  }
}
