import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

interface IHashService {
  hashPassword: (password: string) => Promise<string>;
}

@Injectable()
export class HashService implements IHashService {
  constructor(private readonly configService: ConfigService) {}

  public async hashPassword(password: string) {
    return bcrypt.hash(password, +this.configService.get<string>('SALT'));
  }

  public async comparePassword(reqPassword: string, hashedPassword: string) {
    return bcrypt.compare(reqPassword, hashedPassword);
  }
}
