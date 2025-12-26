import { IsNotEmpty } from 'class-validator';

export class LoginByPasswordDto {
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
