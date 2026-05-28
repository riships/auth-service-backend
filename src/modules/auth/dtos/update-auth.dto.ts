import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Role } from '../enums/role.enums';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsNotEmpty()
  @IsString()
  declare password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  declare role?: Role;

  @IsOptional()
  @IsString()
  declare userId?: string;

  @IsOptional()
  @IsBoolean()
  declare isActive?: boolean;
}
