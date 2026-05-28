import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  declare readonly oldPassword: string;

  @IsNotEmpty()
  @IsString()
  declare readonly newPassword: string;
}
