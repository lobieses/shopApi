import { Module } from '@nestjs/common';
import { JWTService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenPassport } from './services/jwt-access-passport.service';
import { RefreshTokenPassport } from './services/jwt-refresh-passport.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [JWTService, AccessTokenPassport, RefreshTokenPassport],
  exports: [JWTService],
})
export class InternalJwtModule {}
