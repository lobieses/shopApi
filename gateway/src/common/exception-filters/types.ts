export interface IFormattedGraphqlExceptionPayload {
  status_code: number;
  code_name: string;
  description?: any;
  exception_stacktrace?: string | string[];
}
