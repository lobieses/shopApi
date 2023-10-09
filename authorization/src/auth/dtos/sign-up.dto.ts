import {
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Kinds } from '@shop-api/microservices/authorization-types';

export class signUpDto {
  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsEnum(Kinds)
  @IsString()
  kind: Kinds;
}
