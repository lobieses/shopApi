import { IsDefined, IsNumber, Min } from 'class-validator';

export class ChangeQuantityDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;

  @IsDefined()
  @IsNumber()
  changeNum: number;
}
