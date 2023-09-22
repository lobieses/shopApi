import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetLotsListDto {
  @IsOptional()
  @Min(1)
  @IsNumber()
  sellerId?: number;
}
