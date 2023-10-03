import { Injectable } from '@nestjs/common';

interface IStripeHelperService {
  usdToCents: (usd: number) => number;
  calculateExpiredDateInUnix: () => number;
}

const HALF_AN_HOUR_IN_SECONDS = 1800;

@Injectable()
export class StripeHelperService implements IStripeHelperService {
  public usdToCents(usd: number) {
    return Math.round(usd * 100);
  }

  public calculateExpiredDateInUnix() {
    return Math.floor(Date.now() / 1000) + HALF_AN_HOUR_IN_SECONDS;
  }
}
