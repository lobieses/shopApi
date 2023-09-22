import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DefaultValueInterceptor } from './common/interceptors/default-value.interceptor';
import { RpcExceptionFormatterFilter } from './common/exception-filters/rpc-exception-formatter.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  // set global interceptors
  app.useGlobalInterceptors(new DefaultValueInterceptor());

  // set global middlewares
  app.use(cookieParser());

  // define global filters
  app.useGlobalFilters(new RpcExceptionFormatterFilter());

  // get envs
  const configService = app.get(ConfigService);

  // envs
  const PORT = configService.get<string>('PORT');
  const NAME = configService.get<string>('NAME');

  await app.startAllMicroservices();

  await app.listen(PORT);
  console.log(`${NAME} successfully started`);
}

bootstrap();
