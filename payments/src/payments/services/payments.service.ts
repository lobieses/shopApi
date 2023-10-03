import { Injectable } from '@nestjs/common';
import { PaymentHistory, PreparedLots } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface IPaymentsService {
  savePreparedLot: (lotId: number, priceId: string) => Promise<PreparedLots>;
  findPreparedLotByLotId: (lotId: number) => Promise<PreparedLots | null>;
  saveNewSuccessPayment: (
    lotId: number,
    quantity: number,
    buyerId: number,
    sellerId: number,
    totalAmount: number,
  ) => Promise<PaymentHistory>;
}

@Injectable()
export class PaymentsService implements IPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  public savePreparedLot(lotId: number, priceId: string) {
    return this.prisma.preparedLots.create({
      data: {
        lotId,
        priceId,
      },
    });
  }

  public findPreparedLotByLotId(lotId: number) {
    return this.prisma.preparedLots.findFirst({
      where: {
        lotId,
      },
    });
  }

  public saveNewSuccessPayment(
    lotId: number,
    quantity: number,
    buyerId: number,
    sellerId: number,
    totalAmount: number,
  ) {
    return this.prisma.paymentHistory.create({
      data: {
        lotId,
        quantity,
        buyerId,
        sellerId,
        totalAmount,
      },
    });
  }
}
