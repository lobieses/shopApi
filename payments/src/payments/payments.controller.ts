import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsHandler } from './payments.handler';
import { ProductCreatedDto } from './dtos/product-created.dto';
import { GetProductPaymentSessionDto } from './dtos/get-product-payment-session.dto';
import { AuthorizedGuard } from '../common/guards/authorized.guard';
import { ExpiredSessionDto } from './dtos/expired-session.dto';
import { SuccessPaymentDto } from './dtos/success-payment.dto';
import { ENDPOINTS } from '../rpc/endpoints';

interface IPaymentsController {
  getProductPaymentSession: (
    data: GetProductPaymentSessionDto,
  ) => Promise<string>;
  lotCreated: (data: ProductCreatedDto) => Promise<void>;
  expiredSession: (data: ExpiredSessionDto) => Promise<void>;
  successPayment: (data: any) => Promise<void>;
}

@Controller('payments')
export class PaymentsController implements IPaymentsController {
  constructor(private readonly paymentsHandler: PaymentsHandler) {}

  @UseGuards(AuthorizedGuard)
  @MessagePattern(ENDPOINTS.MESSAGES.PAYMENTS.GET_PRODUCT_PAYMENT_SESSION)
  public async getProductPaymentSession(
    @Payload() data: GetProductPaymentSessionDto,
  ) {
    return this.paymentsHandler.createCheckoutSession(data);
  }

  @EventPattern(ENDPOINTS.EVENTS.PAYMENTS.EXPIRED_SESSION)
  public async expiredSession(@Payload() data: ExpiredSessionDto) {
    await this.paymentsHandler.handleExpiredSession(data);
  }

  @EventPattern(ENDPOINTS.EVENTS.PAYMENTS.LOT_CREATED)
  public async lotCreated(@Payload() data: ProductCreatedDto) {
    await this.paymentsHandler.prepareNewLot(data);
  }

  @EventPattern(ENDPOINTS.EVENTS.PAYMENTS.SUCCESS_PAYMENT)
  public async successPayment(@Payload() data: SuccessPaymentDto) {
    await this.paymentsHandler.handleSuccessPayment(data);
  }
}
