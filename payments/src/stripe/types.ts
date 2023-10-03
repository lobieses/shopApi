import Stripe from 'stripe';

export interface IStripeConfig {
  apiKey: string;
  options: Stripe.StripeConfig;
}

export interface ISessionMetadata {
  lotId: string;
  quantity: string;
  buyerId: string;
  sellerId: string;
  totalAmount: string;
}
