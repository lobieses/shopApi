import Stripe from 'stripe';

export const rootConfig: Stripe.StripeConfig = { apiVersion: '2023-08-16' };

export const eventToListen: Stripe.WebhookEndpointCreateParams.EnabledEvent[] =
  ['checkout.session.expired'];
