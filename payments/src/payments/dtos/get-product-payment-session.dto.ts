import { IsDefined, IsNumber, Min } from 'class-validator';

export class GetProductPaymentSessionDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;

  @IsDefined()
  @Min(1)
  @IsNumber()
  quantity: number;
}
