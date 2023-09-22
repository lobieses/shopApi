import { Module } from '@nestjs/common';
import { PaymentsResolver } from './payments.resolver';

@Module({
  providers: [PaymentsResolver],
})
export class PaymentsModule {}
