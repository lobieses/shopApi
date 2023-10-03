import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StripeService } from '../stripe/services/stripe.service';
import { ProductCreatedDto } from './dtos/product-created.dto';
import { GetProductPaymentSessionDto } from './dtos/get-product-payment-session.dto';
import { PaymentsService } from './services/payments.service';
import { RpcHandlerSvc } from '../rpc/services/rpc-handler.service';
import { SERVICE_NAMES } from '../rpc/config/services';
import { firstValueFrom } from 'rxjs';
import {
  GetLotRes,
  IChangeQuantityReq,
  IGetLotReq,
  IChangeQuantityRes,
} from '../rpc/endpoint.types';
import { ExpiredSessionDto } from './dtos/expired-session.dto';
import { SuccessPaymentDto } from './dtos/success-payment.dto';
import { ENDPOINTS } from '../rpc/endpoints';

interface IPaymentsHandler {
  createCheckoutSession: (data: GetProductPaymentSessionDto) => Promise<string>;
  prepareNewLot: (data: ProductCreatedDto) => Promise<void>;
  handleExpiredSession: (data: ExpiredSessionDto) => Promise<void>;
  handleSuccessPayment: (data: SuccessPaymentDto) => Promise<void>;
}

@Injectable()
export class PaymentsHandler implements IPaymentsHandler {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly rpcHandlerService: RpcHandlerSvc,
  ) {}

  public async createCheckoutSession(data: GetProductPaymentSessionDto) {
    const { lotId, quantity, user } = data;

    const preparedLots = await this.paymentsService.findPreparedLotByLotId(
      lotId,
    );

    const lot = await firstValueFrom(
      this.rpcHandlerService.sendMessage<GetLotRes, IGetLotReq>(
        SERVICE_NAMES.PRODUCTS,
        ENDPOINTS.MESSAGES.PRODUCTS.GET_LOT,
        { lotId },
      ),
    );

    if (!preparedLots || !lot)
      throw new NotFoundException('Lot or prepared payment not found');
    if (lot.quantity < quantity)
      throw new BadRequestException("there isn't so many lots");

    const checkoutSession = await this.stripeService.createCheckoutSession(
      preparedLots.priceId,
      lotId,
      quantity,
      user.id,
      lot.sellerId,
      lot.cost * quantity,
    );

    await firstValueFrom(
      this.rpcHandlerService.sendMessage<
        IChangeQuantityRes,
        IChangeQuantityReq
      >(SERVICE_NAMES.PRODUCTS, ENDPOINTS.MESSAGES.PRODUCTS.CHANGE_QUANTITY, {
        lotId,
        changeNum: -quantity,
      }),
    );

    return checkoutSession;
  }

  public async prepareNewLot(data: ProductCreatedDto) {
    const { lotId, lotName, costInUsd } = data;

    const priceId = await this.stripeService.prepareProduct(
      lotId,
      lotName,
      +costInUsd,
    );

    await this.paymentsService.savePreparedLot(lotId, priceId);
  }

  public async handleExpiredSession(data: ExpiredSessionDto) {
    const { lotId, quantity } = data;

    await firstValueFrom(
      this.rpcHandlerService.sendMessage<
        IChangeQuantityRes,
        IChangeQuantityReq
      >(SERVICE_NAMES.PRODUCTS, ENDPOINTS.MESSAGES.PRODUCTS.CHANGE_QUANTITY, {
        lotId: +lotId,
        changeNum: +quantity,
      }),
    );
  }

  public async handleSuccessPayment(data: SuccessPaymentDto) {
    const { lotId, quantity, buyerId, sellerId, totalAmount } = data;

    await this.paymentsService.saveNewSuccessPayment(
      +lotId,
      +quantity,
      +buyerId,
      +sellerId,
      +totalAmount,
    );
  }
}
