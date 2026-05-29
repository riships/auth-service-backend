import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Role } from '../../users/enums/role.enums';

export class RegisterDto {
  @ApiProperty({
    description: 'Email address for the new user',
    example: 'alice@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    description: 'Password for the new user',
    example: 'strongPassword456',
  })
  @IsNotEmpty()
  @IsString()
  declare password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
    required: false,
    default: Role.STUDENT,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of the following values: ${Object.values(Role).join(', ')}`,
  })
  declare role?: Role;

  @ApiProperty({
    description: 'Unique custom user identification ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  declare userId?: string;
}
