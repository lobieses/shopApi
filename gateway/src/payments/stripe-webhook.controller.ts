import { Body, Controller, Post } from '@nestjs/common';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { Stripe } from 'stripe';
import {
  IExpiredSessionEventReq,
  ISuccessPaymentEventReq,
} from '../rpc/endpoint.types';
import { SERVICE_NAMES } from '../rpc/config/services';
import { ISessionMetadata } from './types';
import { ENDPOINTS } from '../rpc/endpoints';

interface IStripeWebhookController {
  stripeWebhook: (event: Stripe.Event) => void;
}

@Controller()
export class StripeWebhookController implements IStripeWebhookController {
  constructor(private readonly rpcHandlerService: RpcHandlerSvc) {}

  @Post('/webhook')
  public stripeWebhook(@Body() event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as unknown as ISessionMetadata;

        this.rpcHandlerService.emitEvent<IExpiredSessionEventReq>(
          [SERVICE_NAMES.PAYMENTS],
          ENDPOINTS.EVENTS.PAYMENTS.EXPIRED_SESSION,
          { lotId: metadata.lotId, quantity: metadata.quantity },
        );

        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as unknown as ISessionMetadata;

        this.rpcHandlerService.emitEvent<ISuccessPaymentEventReq>(
          [SERVICE_NAMES.PAYMENTS],
          ENDPOINTS.EVENTS.PAYMENTS.SUCCESS_PAYMENT,
          metadata,
        );

        break;
      }
    }
  }
}
