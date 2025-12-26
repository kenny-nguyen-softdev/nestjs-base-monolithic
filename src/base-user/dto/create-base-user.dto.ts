import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateBaseUserDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  avatarImage?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
