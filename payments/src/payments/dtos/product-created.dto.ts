import {
  IsDefined,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsValidPrice } from '@shop-api/microservices/common';

export class ProductCreatedDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;

  @IsDefined()
  @MaxLength(100)
  @MinLength(1)
  @IsString()
  lotName: string;

  @IsDefined()
  @IsValidPrice(1)
  @IsNumberString()
  costInUsd: string;
}
