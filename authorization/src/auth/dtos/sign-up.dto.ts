import {
  IsDefined,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserKind } from '@prisma/client';

export class signUpDto {
  @IsDefined()
  @MaxLength(20)
  @MinLength(1)
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsEnum(UserKind)
  @IsString()
  kind: UserKind;
}
