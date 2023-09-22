import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthHandler } from './auth.handler';
import { HashService } from './services/hash.service';
import { InternalJwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [InternalJwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthHandler, HashService],
})
export class AuthModule {}
