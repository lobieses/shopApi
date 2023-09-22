import { Injectable } from '@nestjs/common';

interface IStripeHelperService {
  usdToCents: (usd: number) => number;
}

@Injectable()
export class StripeHelperService implements IStripeHelperService {
  public usdToCents(usd: number) {
    return usd * 100;
  }
}
