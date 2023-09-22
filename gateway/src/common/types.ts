import { Request, Response } from 'express';
import { ITokenPayload } from '../authorization/types';

interface IAuthenticatedReq extends Request {
  user?: ITokenPayload;
}

export interface IGraphQLContext {
  req: IAuthenticatedReq;
  res: Response;
}
