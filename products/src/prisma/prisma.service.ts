import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

interface IPrismaService {
  $executeTransaction: <T>(
    isolationLevel: Prisma.TransactionIsolationLevel,
    query: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => Promise<T>,
  ) => Promise<T>;
}

const MAX_TRANSACTION_RETRIES = 5;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements IPrismaService, OnModuleInit, OnModuleDestroy
{
  public async $executeTransaction<T>(
    isolationLevel: Prisma.TransactionIsolationLevel,
    query: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => Promise<T>,
  ) {
    let retries = 0;
    let result: T;

    while (retries < MAX_TRANSACTION_RETRIES) {
      try {
        result = await this.$transaction<T>(query, {
          isolationLevel,
        });
        break;
      } catch (error) {
        if (error.code === 'P2034') {
          retries++;
          continue;
        }
        throw new InternalServerErrorException(error.message);
      }
    }

    if (!result)
      throw new InternalServerErrorException(
        `Transaction failed after ${MAX_TRANSACTION_RETRIES} attempts with ${isolationLevel} isolation level`,
      );

    return result;
  }

  public async onModuleInit() {
    await this.$connect().catch((e) => console.error(e));
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}
