import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class PasswordResetCreateDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @Matches(/^\S*$/, { message: 'Password should not contain whitespace' })
  password: string;

  /**
   *
   */
  validate() {
    const lowerEmail = this.email.toLowerCase();
    const lowerPassword = this.password.toLowerCase();

    if (lowerPassword === lowerEmail) {
      return { password: 'Password should not be the same as your email' };
    }

    const emailUsername = lowerEmail.includes('@') ? lowerEmail.split('@')[0] : '';

    if (!emailUsername) {
      return { email: 'Email should have a valid username before the "@" symbol' };
    }

    if (lowerPassword.includes(emailUsername)) {
      return { password: 'Password should not contain significant parts of your email' };
    }

    if (lowerEmail.includes(lowerPassword)) {
      return { password: 'Password should not be contained in your email' };
    }

    return true;
  }
}
