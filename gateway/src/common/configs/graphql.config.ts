import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphQLFormattedError } from 'graphql/error';
import { IFormattedGraphqlExceptionPayload } from '../exception-filters/types';
import { GenerateOptions } from '@nestjs/graphql/dist/graphql-definitions.factory';

const TYPE_PATHS = ['./**/*.graphql'];
const PATH = join(process.cwd(), 'src/graphql.ts');
const OUTPUT_AS = 'interface';

export const GraphQLGenerationOptions: GenerateOptions = {
  typePaths: TYPE_PATHS,
  path: PATH,
  outputAs: OUTPUT_AS,
};

export const GraphqlModuleOptions: ApolloDriverConfig = {
  driver: ApolloDriver,
  typePaths: TYPE_PATHS,
  definitions: {
    path: PATH,
    outputAs: OUTPUT_AS,
  },
  context: ({ req, res }) => ({ req, res }),
  formatError: (
    error: GraphQLFormattedError & {
      extensions: IFormattedGraphqlExceptionPayload;
    },
  ) => {
    const message = error.message;
    const extensions = error.extensions;

    const errorData: GraphQLFormattedError = {
      message: message,
      extensions: {
        code_name: extensions.code_name,
        status_code: extensions.status_code || extensions.code,
        explain: extensions.description,
        stacktrace: extensions.exception_stacktrace || extensions.stacktrace,
      },
    };
    return errorData;
  },
};
