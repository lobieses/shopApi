import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class ExpiredSessionDto {
  @IsDefined()
  @IsNumberString()
  @IsString()
  lotId: string;

  @IsDefined()
  @IsNumberString()
  @IsString()
  quantity: string;
}
