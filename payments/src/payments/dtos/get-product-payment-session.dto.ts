import { IsDefined, IsNumber, Min } from 'class-validator';
import { UserFromTokenDto } from '@shop-api/microservices/common';

export class GetProductPaymentSessionDto extends UserFromTokenDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;

  @IsDefined()
  @Min(1)
  @IsNumber()
  quantity: number;
}
