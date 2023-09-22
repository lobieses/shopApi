import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class signInDto {
  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  password: string;
}
