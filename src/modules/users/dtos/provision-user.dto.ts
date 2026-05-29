import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enums';

export enum EntityType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  OTHER = 'other',
}

export class ProvisionUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'alice@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  declare password: string;

  @ApiProperty({
    description: 'Selected role for the user',
    enum: Role,
    example: Role.STUDENT,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  declare role: Role;

  @ApiProperty({
    description: 'Type of entity to link this user account to',
    enum: EntityType,
    example: EntityType.STUDENT,
  })
  @IsNotEmpty()
  @IsEnum(EntityType)
  declare entityType: EntityType;

  @ApiProperty({
    description:
      'The unique identification ID of the linked Student/Teacher/Parent record',
    example: 'stu_12345',
  })
  @IsNotEmpty()
  @IsString()
  declare entityId: string;
}
