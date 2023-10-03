import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ISessionMetadata, IStripeConfig } from '../types';
import { StripeHelperService } from './stripe-helper.service';
import { ConfigService } from '@nestjs/config';
import { eventToListen } from '../config';

interface IStripeService {
  createCheckoutSession: (
    priceId: string,
    lotId: number,
    quantity: number,
    buyerId: number,
    sellerId: number,
    totalAmount: number,
  ) => Promise<string>;
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
    private readonly configService: ConfigService,
  ) {
    if (!stripeOptions.apiKey)
      throw Error('STRIPE_API_KEY for Stripe not provided');

    this.stripe = new Stripe(
      this.stripeOptions.apiKey,
      this.stripeOptions.options,
    );
  }

  public async createCheckoutSession(
    priceId: string,
    lotId: number,
    quantity: number,
    buyerId: number,
    sellerId: number,
    totalAmount: number,
  ) {
    const metadata: ISessionMetadata = {
      lotId: `${lotId}`,
      quantity: `${quantity}`,
      buyerId: `${buyerId}`,
      sellerId: `${sellerId}`,
      totalAmount: `${totalAmount}`,
    };

    const checkoutSession = await this.stripe.checkout.sessions.create({
      success_url: 'https://google.com/',
      line_items: [{ price: priceId, quantity }],
      mode: 'payment',
      metadata: metadata as unknown as Stripe.MetadataParam,
      expires_at: this.stripeHelperService.calculateExpiredDateInUnix(),
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
      this.logger.error(e);
      throw new InternalServerErrorException('Error when preparing product');
    }
  }

  public async onModuleInit() {
    //Check on authorize
    await this.stripe.accounts.retrieve().catch((e) => {
      this.logger.error('Error with Stripe account');
      throw Error(e);
    });

    //Check webhooks configs
    const GATEWAY_STRIPE_WEBHOOK_ENDPOINT = this.configService.get<string>(
      'GATEWAY_STRIPE_WEBHOOK_ENDPOINT',
    );
    const IS_ENABLED_LOCAL_WEBHOOK_FORWARDING = this.configService.get<string>(
      'IS_ENABLED_LOCAL_WEBHOOK_FORWARDING',
    );

    if (
      IS_ENABLED_LOCAL_WEBHOOK_FORWARDING &&
      IS_ENABLED_LOCAL_WEBHOOK_FORWARDING !== 'false'
    )
      return;

    const webhooks = await this.stripe.webhookEndpoints.list();

    if (webhooks.data.length) {
      if (
        webhooks.data.some(
          (webhook) =>
            webhook.url === GATEWAY_STRIPE_WEBHOOK_ENDPOINT &&
            JSON.stringify(webhook.enabled_events) ===
              JSON.stringify(eventToListen),
        )
      )
        return;
    }

    await this.stripe.webhookEndpoints.create({
      url: GATEWAY_STRIPE_WEBHOOK_ENDPOINT,
      enabled_events: eventToListen,
    });
  }
}
