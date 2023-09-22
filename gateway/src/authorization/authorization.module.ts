import { Module } from '@nestjs/common';
import { AuthorizationResolver } from './authorization.resolver';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthorizationResolver],
})
export class AuthorizationModule {}
