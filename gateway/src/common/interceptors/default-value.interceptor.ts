import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { defaultIfEmpty } from 'rxjs/operators';
import { map } from 'rxjs';

const DEFAULT_RESPONSE_MESSAGE = true;

@Injectable()
export class DefaultValueInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((res) =>
        typeof res === 'undefined' ? DEFAULT_RESPONSE_MESSAGE : res,
      ),
      defaultIfEmpty(DEFAULT_RESPONSE_MESSAGE),
    );
  }
}
