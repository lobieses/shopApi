import { IServiceConfig } from './services';
import { Transport } from '@nestjs/microservices';
import { AmqpConnectionManagerSocketOptions } from '@nestjs/microservices/external/rmq-url.interface';
import { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

interface IConnectionData extends IServiceConfig {
  rmq_url: string;
}

export const configFactory = ({
  queue,
  rmq_url,
  connection_name,
}: IConnectionData): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [rmq_url],
    queue: queue.name,
    queueOptions: {
      durable: !!queue.durable,
    },
    socketOptions: {
      clientProperties: {
        connection_name,
      },
    } as AmqpConnectionManagerSocketOptions,
  },
});
