import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { RpcHandlerSvc } from './services/rpc-handler.service';
import { IServiceConfig } from '@shop-api/microservices/rpc';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { configFactory } from './config/config.factory';
import { IRmqClients } from './types';

@Global()
@Module({})
export class RpcModule {
  static forRoot(services: IServiceConfig[]): DynamicModule {
    const serviceClients: Provider = {
      provide: `SERVICE_CLIENTS`,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rmq_url = configService.get('RMQ_URL');

        return services.reduce<IRmqClients>((acc, serviceData) => {
          const config = configFactory({ ...serviceData, rmq_url });

          acc[serviceData.name] = ClientProxyFactory.create(config);

          return acc;
        }, {});
      },
    };

    return {
      module: RpcModule,
      providers: [serviceClients, RpcHandlerSvc],
      exports: [RpcHandlerSvc],
    };
  }
}
