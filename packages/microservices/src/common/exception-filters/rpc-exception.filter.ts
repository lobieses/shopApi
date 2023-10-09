import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IServiceExceptionPayload } from './types';

@Catch()
export class RpcValidationFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: HttpException | TypeError | Error) {
    let exceptionPayload: IServiceExceptionPayload;

    if (exception instanceof HttpException) {
      const code = exception.getStatus();
      const receivedExceptionPayload =
        exception.getResponse() as IServiceExceptionPayload;

      const servicesWay: string[] = [
        this.serviceName,
        ...(receivedExceptionPayload?.servicesWay || []),
      ];

      exceptionPayload = {
        code,
        servicesWay,
        description:
          receivedExceptionPayload.description || receivedExceptionPayload,
      };
    } else if (exception instanceof TypeError) {
      exceptionPayload = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        servicesWay: [this.serviceName],
        description: {
          message: exception.message,
          stack: exception.stack,
        },
      };
    } else if (exception instanceof Error) {
      exceptionPayload = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        servicesWay: [this.serviceName],
        description: {
          message: exception.message,
          stack: exception.stack,
        },
      };
    } else {
      exceptionPayload = {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        servicesWay: [this.serviceName],
      };
    }

    return new RpcException(exceptionPayload);
  }
}
