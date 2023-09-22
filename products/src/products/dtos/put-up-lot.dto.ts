import {
  IsDefined,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserFromTokenDto } from '../../common/dto/user-from-token.dto';

export class PutUpLotDto extends UserFromTokenDto {
  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  lotName: string;

  @IsDefined()
  @Max(1000)
  @Min(1)
  @IsNumber()
  quantity: number;
}
