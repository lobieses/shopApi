import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class SuccessPaymentDto {
  @IsDefined()
  @IsNumberString()
  @IsString()
  lotId: string;

  @IsDefined()
  @IsNumberString()
  @IsString()
  quantity: string;

  @IsDefined()
  @IsNumberString()
  @IsString()
  buyerId: string;

  @IsDefined()
  @IsNumberString()
  @IsString()
  sellerId: string;

  @IsDefined()
  @IsNumberString()
  @IsString()
  totalAmount: string;
}
