import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Products } from '@prisma/client';

interface IProductsService {
  getLotsList: (where: any) => Promise<Products[]>;
  getLot: (lotId: number) => Promise<Products | null>;
  createLot: (
    userId: number,
    sellerName: string,
    lotName: string,
    cost: number,
    quantity: number,
  ) => Promise<Products>;

  changeLotQuantity: (lotId: number, changeNum: number) => Promise<Products>;
}

@Injectable()
export class ProductsService implements IProductsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getLotsList(where: any) {
    return this.prisma.products.findMany({ where });
  }

  public async getLot(lotId: number) {
    return this.prisma.products.findFirst({ where: { id: lotId } });
  }

  public createLot(
    sellerId: number,
    sellerName: string,
    lotName: string,
    cost: number,
    quantity: number,
  ) {
    return this.prisma.products.create({
      data: { sellerId, sellerName, lotName, cost, quantity },
    });
  }

  public async changeLotQuantity(lotId: number, changeNum: number) {
    return this.prisma.$executeTransaction(
      Prisma.TransactionIsolationLevel.Serializable,
      (prisma) => {
        return prisma.products.update({
          where: { id: lotId },
          data: { quantity: { increment: changeNum } },
        });
      },
    );
  }
}
