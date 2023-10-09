import { DynamicModule, Module, Provider } from '@nestjs/common';
import { RpcHandlerSvc } from './services/rpc-handler.service';
import { IServiceConfig } from './config/types';
import { ClientProxyFactory } from '@nestjs/microservices';
import { configFactory } from './config/config.factory';
import { IRmqClients } from './types';
import { RpcBrokerService } from './services/rpc-services-broker.service';
import { RpcAuthorizationService } from './services/rpc-authorization.service';

interface IRootOptions {
  RMQ_URL: string;
  services: IServiceConfig[];
  isGlobal?: boolean;
}
@Module({})
export class RpcModule {
  static forRoot(options: IRootOptions): DynamicModule {
    const { RMQ_URL, services, isGlobal = false } = options;

    const rmqServices = services.reduce<IRmqClients>((acc, serviceData) => {
      const config = configFactory({ ...serviceData, rmq_url: RMQ_URL });

      acc[serviceData.name] = ClientProxyFactory.create(config);

      return acc;
    }, {});

    const serviceClients: Provider = {
      provide: 'SERVICE_CLIENTS',
      useValue: rmqServices,
    };

    return {
      module: RpcModule,
      global: isGlobal,
      providers: [
        serviceClients,
        RpcHandlerSvc,
        RpcBrokerService,
        RpcAuthorizationService,
      ],
      exports: [RpcHandlerSvc],
    };
  }
}
