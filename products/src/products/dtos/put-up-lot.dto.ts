import {
  IsDefined,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsNumberString,
} from 'class-validator';
import { IsValidPrice, UserFromTokenDto } from '@shop-api/microservices/common';

export class PutUpLotDto extends UserFromTokenDto {
  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  lotName: string;

  @IsDefined()
  @IsValidPrice(1)
  @IsNumberString()
  cost: string;

  @IsDefined()
  @Max(1000)
  @Min(1)
  @IsNumber()
  quantity: number;
}
