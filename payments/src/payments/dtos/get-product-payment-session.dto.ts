import { IsDefined, IsNumber, Min } from 'class-validator';
import { UserFromTokenDto } from '../../common/dtos/user-from-token.dto';

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
