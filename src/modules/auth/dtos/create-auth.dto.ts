import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

import { Role } from '../enums/role.enums';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  declare role?: Role;

  @IsNotEmpty()
  @IsString()
  declare password: string;

  @IsOptional()
  @IsString()
  declare userId?: string;

  @IsOptional()
  @IsBoolean()
  declare isActive?: boolean;
}
