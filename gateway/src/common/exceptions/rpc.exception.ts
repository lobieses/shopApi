import { HttpException } from '@nestjs/common';

export class RpcException extends HttpException {
  constructor(errorPayload: any, code: number) {
    super(errorPayload, code);
  }
}
