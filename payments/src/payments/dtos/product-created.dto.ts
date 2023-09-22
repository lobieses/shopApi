import {
  IsDefined,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ProductCreatedDto {
  @IsDefined()
  @Min(1)
  @IsNumber()
  lotId: number;

  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  lotName: string;

  @IsDefined()
  @Min(1)
  @IsNumber()
  costInUsd: number;
}
