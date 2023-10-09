import {
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { IRmqClients } from '../types';
import { ClientProxy } from '@nestjs/microservices';

interface IRpcBrokerService {
  getClient: (serviceName: string) => ClientProxy;
  getArrayOfClients: (servicesName: string[]) => ClientProxy[];
}

@Injectable()
export class RpcBrokerService implements IRpcBrokerService, OnModuleInit {
  constructor(
    @Inject('SERVICE_CLIENTS')
    private readonly serviceClients: IRmqClients,
  ) {}

  public getClient(clientName: string) {
    const client = this.serviceClients[clientName];

    if (!client)
      throw new InternalServerErrorException(
        `RMQ Client '${clientName}' not found`,
      );

    return client;
  }

  public getArrayOfClients(clientsName: string[]) {
    return clientsName.map((clientName) => {
      const client = this.serviceClients[clientName];

      if (!client)
        throw new InternalServerErrorException(
          `RMQ Client '${clientName}' not found`,
        );

      return client;
    });
  }

  public async onModuleInit() {
    const clientsConnections = Object.keys(this.serviceClients).map(
      (serviceName) => this.serviceClients[serviceName].connect(),
    );

    try {
      await Promise.all(clientsConnections);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
