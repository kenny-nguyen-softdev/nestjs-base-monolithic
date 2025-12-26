import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetVerifyDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
