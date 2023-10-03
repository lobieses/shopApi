import { Module } from '@nestjs/common';
import { PaymentsResolver } from './payments.resolver';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  providers: [PaymentsResolver],
  controllers: [StripeWebhookController],
})
export class PaymentsModule {}
