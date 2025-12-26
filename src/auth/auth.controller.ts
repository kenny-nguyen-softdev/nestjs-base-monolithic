import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { LoginByPasswordResponse } from './types/login-by-password-response.interface';
import { LoginByPasswordDto } from './dto/login-by-password.dto';
import { AuthService } from './auth.service';
import { BackendValidationPipe } from 'src/core/pipes/backendValidation.pipe';
import { StaffRegisterDto } from './dto/user-register.dto';
import { ExpressRequest } from 'src/core/types/express-request.interface';
import { StaffType } from './types/staff.types';
import { CommonResponse } from 'src/core/types/response';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetVerifyDto } from './dto/password-reset-verify.dto';
import { PasswordResetCreateDto } from './dto/password-reset-create.dto';

@Controller('auth')
export class AuthController {
  /**
   *
   * @param authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a staff with the provided email and password. If the credentials
   * are valid, a JWT token is generated and returned as part of the response.
   *
   * @param loginByPasswordDto - The email and password of the staff to authenticate.
   * @returns A Promise that resolves to a LoginByPasswordResponse interface.
   *          If the credentials are invalid, the Promise rejects with a
   *          HttpException.
   */
  @Post('/login')
  @UsePipes(new BackendValidationPipe())
  async login(@Body() loginByPasswordDto: LoginByPasswordDto): Promise<CommonResponse<LoginByPasswordResponse>> {
    return await this.authService.loginByPassword(loginByPasswordDto);
  }

  /**
   * Registers a new staff with the provided details. The staff's information is
   * encapsulated in the StaffRegisterDto object, which includes fields such as
   * name, email, password, and phone number. Upon successful registration,
   * a JWT token is generated and returned as part of the response.
   *
   * @param staffRegisterDto - The data transfer object containing the staff's registration details.
   * @returns A Promise that resolves to a LoginByPasswordResponse interface,
   *          containing the registered staff's information and a JWT token.
   */
  @Post('/register')
  @UsePipes(new BackendValidationPipe())
  async register(@Body() staffRegisterDto: StaffRegisterDto): Promise<CommonResponse<LoginByPasswordResponse>> {
    return await this.authService.registerStaff(staffRegisterDto);
  }

  /**
   * Retrieves the profile information of the currently authenticated staff.
   *
   * This method extracts the staff information from the request object,
   * which is set by the authentication middleware. The staff profile
   * is then obtained and returned.
   *
   * @param request - The Express request object, which includes the authenticated staff's information.
   * @returns The profile of the authenticated staff as a StaffType object.
   */
  @Get('/user-profile')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  staffProfile(@Req() request: ExpressRequest): Promise<CommonResponse<StaffType>> {
    return this.authService.staffProfile(request);
  }

  /**
   * Verifies a refresh token and generates a new JWT token if the refresh token is valid.
   *
   * @param refreshToken - The refresh token to verify.
   * @returns A Promise that resolves to a new JWT token if the refresh token is valid.
   *          If the refresh token is invalid, the Promise rejects with a HttpException.
   */
  @Post('/refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<CommonResponse<{ accessToken: string }>> {
    return await this.authService.verifyRefreshToken(refreshToken);
  }

  /**
   * Logs out the currently authenticated staff by invalidating the provided refresh token.
   *
   * @param refreshToken - The refresh token to invalidate.
   * @returns A Promise that resolves to an object containing a success message if the logout is successful.
   *          If the refresh token is invalid, the Promise rejects with a HttpException.
   */
  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Body('refreshToken') refreshToken: string): Promise<CommonResponse> {
    return await this.authService.logout(refreshToken);
  }

  /**
   * Initiates the password reset process by sending a reset link to the provided email.
   *
   * @param email - The email address of the user requesting a password reset.
   * @param frontendUrl
   * @param PasswordResetRequestDto
   * @returns A Promise that resolves to a CommonResponse indicating the success or failure of the operation.
   */
  @Post('/forgot-password')
  async passwordReset(@Body() PasswordResetRequestDto: PasswordResetRequestDto): Promise<CommonResponse> {
    return await this.authService.passwordReset(PasswordResetRequestDto);
  }

  /**
   * Verifies the validity of a password reset token.
   *
   * @param token - The password reset token to verify.
   * @param PasswordResetVerifyDto
   * @returns A Promise that resolves to a CommonResponse containing the user's information (excluding the password) if the token is valid.
   */
  @Post('/verify-reset-password-token')
  async verifyResetToken(
    @Body() PasswordResetVerifyDto: PasswordResetVerifyDto,
  ): Promise<CommonResponse<Omit<StaffType, 'password'>>> {
    return await this.authService.verifyResetToken(PasswordResetVerifyDto);
  }

  /**
   * Resets the user's password using the provided email, new password, and reset token.
   *
   * @param body - An object containing the user's email, new password, and the reset token.
   * @param body.email
   * @param body.password
   * @param body.token
   * @param PasswordResetCreateDto
   * @returns A Promise that resolves to a CommonResponse indicating the success or failure of the password reset operation.
   */
  @Post('/reset-password')
  async resetPassword(@Body() PasswordResetCreateDto: PasswordResetCreateDto): Promise<CommonResponse> {
    return await this.authService.resetPassword(PasswordResetCreateDto);
  }
}
