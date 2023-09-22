import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import Stripe from 'stripe';
import { IStripeConfig } from '../types';
import { StripeHelperService } from './stripe-helper.service';

interface IStripeService {
  createCheckoutSession: (priceId: string, quantity: number) => Promise<string>;
  prepareProduct: (
    lotId: number,
    lotName: string,
    costInUsd: number,
  ) => Promise<string>;
}

@Injectable()
export class StripeService implements IStripeService, OnModuleInit {
  private readonly stripe: Stripe;

  constructor(
    @Inject('STRIPE_OPTIONS') private readonly stripeOptions: IStripeConfig,
    private readonly stripeHelperService: StripeHelperService,
    private readonly logger: Logger,
  ) {
    if (!stripeOptions.apiKey)
      throw Error('STRIPE_API_KEY for Stripe not provided');

    this.stripe = new Stripe(
      this.stripeOptions.apiKey,
      this.stripeOptions.options,
    );
  }

  public async createCheckoutSession(priceId: string, quantity: number) {
    const checkoutSession = await this.stripe.checkout.sessions.create({
      success_url: 'https://google.com/',
      line_items: [{ price: priceId, quantity }],
      mode: 'payment',
    });

    return checkoutSession.url;
  }

  public async prepareProduct(
    lotId: number,
    lotName: string,
    costInUsd: number,
  ) {
    try {
      const createdProduct = await this.stripe.products.create({
        name: lotName,
      });

      const createdPrice = await this.stripe.prices.create({
        product: createdProduct.id,
        currency: 'USD',
        unit_amount: this.stripeHelperService.usdToCents(costInUsd),
        billing_scheme: 'per_unit',
      });

      return createdPrice.id;
    } catch (e) {
      this.logger.error(`Error when preparing product. Product id - ${lotId}`);
      throw new InternalServerErrorException('Error when preparing product');
    }
  }

  public async onModuleInit() {
    await this.stripe.accounts.retrieve().catch((e) => {
      this.logger.error('Error with Stripe account');
      throw Error(e);
    });
  }
}
