import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RpcValidationFilter } from './common/exception-filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // create mock app for taking envs
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(),
  );

  const config = appContext.get(ConfigService);

  // envs
  const RMQ_URL = config.get<string>('RMQ_URL');
  const QUEUE = config.get<string>('QUEUE');
  const NAME = config.get<string>('NAME');

  // clear mock app
  await appContext.close();

  const svc = await NestFactory.createMicroservice<RmqOptions>(MainModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RMQ_URL],
      queue: QUEUE,
      queueOptions: { durable: false },
      prefetchCount: 1,
      socketOptions: {
        clientProperties: {
          connection_name: NAME,
        },
      },
    },
  });

  // define global filters
  svc.useGlobalFilters(new RpcValidationFilter(NAME));

  // define global pipes
  svc.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false,
    }),
  );

  await svc.listen();

  console.log(`${NAME} service successfully started`);
}

bootstrap();
