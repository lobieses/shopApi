import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentsHandler } from './payments.handler';
import { PaymentsService } from './services/payments.service';

@Module({
  imports: [StripeModule],
  providers: [PaymentsHandler, PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
