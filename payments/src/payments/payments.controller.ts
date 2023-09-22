import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsHandler } from './payments.handler';
import { ProductCreatedDto } from './dtos/product-created.dto';
import { GetProductPaymentSessionDto } from './dtos/get-product-payment-session.dto';

interface IPaymentsController {
  //TODO: types
  getProductPaymentSession: (
    data: GetProductPaymentSessionDto,
  ) => Promise<string>;
  lotCreated: (data: ProductCreatedDto) => Promise<void>;
}

@Controller('payments')
export class PaymentsController implements IPaymentsController {
  constructor(private readonly paymentsHandler: PaymentsHandler) {}

  //TODO: authorization
  @MessagePattern('payments.get-product-payment-session')
  public async getProductPaymentSession(
    @Payload() data: GetProductPaymentSessionDto,
  ) {
    return this.paymentsHandler.createCheckoutSession(data);
  }

  @EventPattern('payments.event.lot-created')
  public async lotCreated(@Payload() data: ProductCreatedDto) {
    await this.paymentsHandler.prepareNewLot(data);
  }
}
