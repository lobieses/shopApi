import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ITokenPayload, Kinds } from '../../endpoints/authorization-types';
import { Type } from 'class-transformer';

class UserPayloadDto implements ITokenPayload {
  @IsDefined()
  @Min(1)
  @IsNumber()
  id: number;

  @IsDefined()
  @MinLength(1)
  @IsString()
  name: string;

  @IsDefined()
  @IsEnum(Kinds)
  @IsString()
  kind: Kinds;
}

export class UserFromTokenDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => UserPayloadDto)
  user: UserPayloadDto;
}
