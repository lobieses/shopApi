import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { GraphQLErrorExtensions } from 'graphql/error';
import { IFormattedGraphqlExceptionPayload } from './types';

@Catch()
export class RpcExceptionFormatterFilter implements GqlExceptionFilter {
  catch(exception: HttpException | TypeError | Error) {
    let extensions: GraphQLErrorExtensions & {
      http: {
        status: number;
      };
    } & IFormattedGraphqlExceptionPayload;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const exceptionPayload = exception.getResponse();
      delete exceptionPayload['code'];

      extensions = {
        http: { status },
        status_code: status,
        code_name: HttpStatus[status] || 'UNKNOWN_ERROR',
        description: exceptionPayload,
        exception_stacktrace: exception.stack,
      };
    } else if (exception instanceof TypeError) {
      extensions = {
        http: { status: HttpStatus.INTERNAL_SERVER_ERROR },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        code_name: 'TYPE_ERROR',
        exception_stacktrace: exception.stack,
      };
    } else if (exception instanceof Error) {
      extensions = {
        http: { status: HttpStatus.INTERNAL_SERVER_ERROR },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        code_name: 'ERROR',
        exception_stacktrace: exception.stack,
      };
    } else {
      extensions = {
        http: { status: HttpStatus.INTERNAL_SERVER_ERROR },
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        code_name: 'UNRESOLVED_ERROR',
      };
    }

    return new GraphQLException(exception.message, {
      extensions,
    });
  }
}
