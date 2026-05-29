import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'password',
    description: 'Old password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  declare readonly oldPassword: string;

  @ApiProperty({
    example: 'password',
    description: 'New password of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  declare readonly newPassword: string;
}
