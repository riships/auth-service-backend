import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../enums/role.enums';

export class CreateUserDto {
  @ApiProperty({
    example: 'alice@example.com',
    description: 'Email of the user',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    example: Role.ADMIN,
    description: 'Role of the user',
    required: true,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  declare role?: Role;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  declare password: string;

  @ApiProperty({
    example: 'user-id',
    description: 'User ID of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare userId?: string;

  @ApiProperty({
    example: true,
    description: 'Is active status of the user',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  declare isActive?: boolean;
}
