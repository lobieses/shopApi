import { Injectable } from '@nestjs/common';
import { RpcHandlerSvc as McRpcHandlerSvc } from '../../../rpc/services/rpc-handler.service';
import { RpcAuthorizationService } from './rpc-authorization.service';
import { RpcBrokerService } from '../../../rpc/services/rpc-services-broker.service';

@Injectable()
export class RpcHandlerSvc extends McRpcHandlerSvc {
  constructor(
    rpcAuthorizationService: RpcAuthorizationService,
    rpcBrokerService: RpcBrokerService,
  ) {
    // @ts-ignore
    super(rpcAuthorizationService, rpcBrokerService);
  }
}
