import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from '../stripe/services/stripe.service';
import { ProductCreatedDto } from './dtos/product-created.dto';
import { GetProductPaymentSessionDto } from './dtos/get-product-payment-session.dto';
import { PaymentsService } from './services/payments.service';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { firstValueFrom } from 'rxjs';
import { GetLotRes, IGetLotInput } from '../rpc/endpoint.types';

interface IPaymentsHandler {
  createCheckoutSession: (data: GetProductPaymentSessionDto) => Promise<string>;
  prepareNewLot: (data: ProductCreatedDto) => Promise<void>;
}

@Injectable()
export class PaymentsHandler implements IPaymentsHandler {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly rpcHandlerService: RpcHandlerSvc,
  ) {}

  public async createCheckoutSession(data: GetProductPaymentSessionDto) {
    const { lotId, quantity } = data;

    const preparedLots = await this.paymentsService.findPreparedLotByLotId(
      lotId,
    );

    const lot = await firstValueFrom(
      this.rpcHandlerService.sendMessage<GetLotRes, IGetLotInput>(
        SERVICE_NAMES.PRODUCTS,
        'products.get-lot',
        { lotId },
      ),
    );

    if (!preparedLots || !lot)
      throw new NotFoundException('Lot or prepared payment not found');

    return this.stripeService.createCheckoutSession(
      preparedLots.priceId,
      quantity,
    );
  }

  public async prepareNewLot(data: ProductCreatedDto) {
    const { lotId, lotName, costInUsd } = data;

    const priceId = await this.stripeService.prepareProduct(
      lotId,
      lotName,
      costInUsd,
    );

    await this.paymentsService.savePreparedLot(lotId, priceId);
  }
}
