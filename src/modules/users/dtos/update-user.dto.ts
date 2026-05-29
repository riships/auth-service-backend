import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Role } from '../enums/role.enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  declare email?: string;

  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare password: string;

  @ApiProperty({
    example: Role.ADMIN,
    description: 'Role of the user',
    required: false,
  })
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  declare role?: Role;

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
