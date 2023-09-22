import { Injectable } from '@nestjs/common';
import { PreparedLots } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface IPaymentsService {
  savePreparedLot: (lotId: number, priceId: string) => Promise<PreparedLots>;
  findPreparedLotByLotId: (lotId: number) => Promise<PreparedLots | null>;
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
}
