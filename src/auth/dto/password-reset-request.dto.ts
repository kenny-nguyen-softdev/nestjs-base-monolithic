import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PasswordResetRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  frontendUrl: string;
}
