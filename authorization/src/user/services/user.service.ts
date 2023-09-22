import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserKind } from '@prisma/client';

interface IUserService {
  createUser: (
    name: string,
    password: string,
    kind: UserKind,
  ) => Promise<void | User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUser(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }

  public async createUser(name: string, password: string, kind: UserKind) {
    const existUser = await this.getUser(name);

    if (existUser) {
      throw new BadRequestException('user with this name already exists');
    }

    return this.prisma.user.create({
      data: {
        name,
        password,
        kind,
      },
    });
  }
}
