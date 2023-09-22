import {
  DynamicModule,
  Global,
  Logger,
  Module,
  Provider,
} from '@nestjs/common';
import { IStripeConfig } from './types';
import { StripeService } from './services/stripe.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StripeHelperService } from './services/stripe-helper.service';

@Global()
@Module({})
export class StripeModule {
  static forRoot(options: Stripe.StripeConfig): DynamicModule {
    const stripeOptions: Provider = {
      provide: `STRIPE_OPTIONS`,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IStripeConfig => ({
        apiKey: configService.get<string>('STRIPE_API_KEY'),
        options,
      }),
    };

    return {
      module: StripeModule,
      providers: [stripeOptions, StripeService, StripeHelperService, Logger],
      controllers: [],
      exports: [StripeService],
    };
  }
}
