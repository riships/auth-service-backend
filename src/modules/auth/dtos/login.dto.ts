import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'alice@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'strongPassword456',
  })
  @IsNotEmpty()
  @IsString()
  declare password: string;
}
