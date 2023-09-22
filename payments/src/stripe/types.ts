import Stripe from 'stripe';

export interface IStripeConfig {
  apiKey: string;
  options: Stripe.StripeConfig;
}
