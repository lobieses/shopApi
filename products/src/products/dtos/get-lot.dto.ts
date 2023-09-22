import { IsDefined, IsNumber, Min } from 'class-validator';

export class GetLotDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;
}
