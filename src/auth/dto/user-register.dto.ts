import { IsNotEmpty } from 'class-validator';

export class StaffRegisterDto {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly phoneNumber: string;
}
