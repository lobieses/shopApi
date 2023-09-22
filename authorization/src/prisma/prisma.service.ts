import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public async onModuleInit() {
    await this.$connect().catch((e) => console.error(e));
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
