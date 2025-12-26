import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { LoginByPasswordDto } from './dto/login-by-password.dto';
import { JwtService } from 'src/core/services/jwt.service';
import { omit } from 'src/core/utils';
import { LoginByPasswordResponse } from './types/login-by-password-response.interface';
import { ErrorMessages } from 'src/core/types';
import { ExpressRequest } from 'src/core/types/express-request.interface';
import { StaffType } from './types/staff.types';
import { Staff } from '../staff/entities/staff.entity';
import { StaffRegisterDto } from './dto/user-register.dto';
import { StaffRegisterResponse } from './types/user-register-response.interface';
import { Session } from 'src/session/entities/session.entity';
import { generatePasswordResetToken } from 'src/core/utils/password-reset.utils';
import { PasswordResetToken } from 'src/password-reset/entities/password-reset.entity';
import { EmailService } from 'src/email/email.service';
import { BaseUser } from 'src/base-user/entities/base-user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse } from 'src/core/types/response';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { PasswordResetVerifyDto } from './dto/password-reset-verify.dto';
import { PasswordResetCreateDto } from './dto/password-reset-create.dto';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';
import { RolePermission } from 'src/role-permission/entities/role-permission.entity';

@Injectable()
export class AuthService {
  /**
   *
   * @param staffRepository
   * @param sessionRepository
   * @param passwordResetTokenRepository
   * @param userPermissionRepository
   * @param rolePermissionRepository
   * @param emailService
   */
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Login a staff using password
   *
   * @param loginByPasswordDto - The login by password DTO
   * @returns The login by password response
   */
  loginByPassword = async (
    loginByPasswordDto: LoginByPasswordDto,
  ): Promise<CommonResponse<LoginByPasswordResponse>> => {
    // Find the staff by the email
    const staff = await this.staffRepository.findOne({
      where: {
        baseUser: {
          email: loginByPasswordDto.email,
        },
      },
      relations: ['baseUser'],
    });

    // If the staff is not found, throw a bad request exception
    if (!staff) {
      return new ErrorResponse('Staff not found', HttpStatus.NOT_FOUND);
    }

    // Check if the password matches
    const isPasswordMatch = await new JwtService().checkPasswordMatch(loginByPasswordDto.password, staff.password);

    // If the password does not match, throw a bad request exception
    if (!isPasswordMatch) {
      return new ErrorResponse('Invalid password', HttpStatus.BAD_REQUEST);
    }

    // Generate a JWT token for the staff
    const token = new JwtService().generateJwtToken(staff);
    const refreshToken = await new JwtService().generateRefreshToken();

    const newSession = this.sessionRepository.create({
      staff,
      refreshToken,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });
    await this.sessionRepository.save(newSession);

    // Return the login by password response
    return new SuccessResponse({
      staff: omit(staff, 'password'),
      accessToken: token,
      refreshToken,
    });
  };

  /**
   * Register a new staff
   *
   * @param staffRegisterDto The staff register dto
   * @returns The staff register response
   * @throws HttpException If the staff already exists or if the input is invalid
   */
  registerStaff = async (staffRegisterDto: StaffRegisterDto): Promise<CommonResponse<StaffRegisterResponse>> => {
    // Find the staff by the email
    const staffByEmail = await this.staffRepository.findOne({
      where: {
        baseUser: {
          email: staffRegisterDto.email,
        },
      },
      relations: ['baseUser'],
    });
    // Find the staff by the phone number
    const staffByPhoneNumber = await this.staffRepository.findOne({
      where: {
        baseUser: {
          phoneNumber: staffRegisterDto.phoneNumber,
        },
      },
      relations: ['baseUser'],
    });

    // Check if the staff already exists
    const errorResponse = {
      errors: {} as ErrorMessages,
    };
    if (staffByEmail) {
      errorResponse.errors.email = 'Email has already been taken';
    }
    if (staffByPhoneNumber) {
      errorResponse.errors.phoneNumber = 'PhoneNumber has already been taken';
    }

    if (staffByEmail || staffByPhoneNumber) {
      return new ErrorResponse(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newBaseUser = new BaseUser();
    Object.assign(newBaseUser, staffRegisterDto);
    // Create a new staff
    const newStaff = this.staffRepository.create({
      ...staffRegisterDto,
      baseUser: newBaseUser,
    });
    const hashPassword = await new JwtService().generateHashedPassword(staffRegisterDto.password);

    Object.assign(newStaff, {
      ...staffRegisterDto,
      password: hashPassword,
    });

    // Save the new staff
    const createdStaff = await this.staffRepository.save(newStaff);
    console.log(createdStaff);

    // Generate a JWT token for the staff
    const token = new JwtService().generateJwtToken(createdStaff);
    const refreshToken = await new JwtService().generateRefreshToken();

    const newSession = this.sessionRepository.create({
      staff: createdStaff,
      refreshToken,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    });
    await this.sessionRepository.save(newSession);

    // Return the staff register response
    return new SuccessResponse({
      staff: omit(createdStaff, 'password'),
      accessToken: token,
      refreshToken,
    });
  };

  /**
   * Get the profile of the staff from the JWT token in the header
   * @param request The express request object
   * @returns The staff profile
   */
  staffProfile = async (request: ExpressRequest): Promise<CommonResponse<StaffType>> => {
    const staff = request.staff as Staff;

    // If the staff is not found, throw a not found exception
    if (!staff) {
      return new ErrorResponse('Staff not found', HttpStatus.NOT_FOUND);
    }

    const [userPermissions, rolePermissions] = await Promise.all([
      this.userPermissionRepository.find({
        where: {
          userId: staff.id,
        },
        relations: ['permission'],
      }),
      this.rolePermissionRepository.find({
        where: {
          roleId: staff.role.id,
        },
        relations: ['permission'],
      }),
    ]);
    const allUserPermissions = userPermissions.map((p) => p.permission.key);

    // Priority is given to active user permissions
    const activeUserPermissions = userPermissions.filter((p) => p.isActive).map((p) => p.permission.key);

    // Then, we add active role permissions that are not in user's permissions list
    const activeRolePermissions = rolePermissions
      .filter((p) => p.isActive && !allUserPermissions.includes(p.permission.key))
      .map((p) => p.permission.key);

    // Finally, we combine all permissions
    const permissionKeys = Array.from(new Set([...activeUserPermissions, ...activeRolePermissions]));
    staff.permissionKeys = permissionKeys;

    // Return the staff profile, excluding the password
    return new SuccessResponse(omit(staff, 'password'));
  };

  /**
   * Verify a refresh token and generate a new JWT token if the refresh token is valid
   *
   * @param refreshToken The refresh token to verify
   * @returns A Promise that resolves to a new JWT token if the refresh token is valid
   *          If the refresh token is invalid, the Promise rejects with a HttpException
   */
  verifyRefreshToken = async (refreshToken: string): Promise<CommonResponse<{ accessToken: string }>> => {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
      relations: ['staff.baseUser'],
    });

    // If the session is not found, throw a not found exception
    if (!session) {
      return new ErrorResponse('Invalid refresh token', HttpStatus.BAD_REQUEST);
    }

    if (session.revoked) {
      return new ErrorResponse('Refresh token has been revoked', HttpStatus.BAD_REQUEST);
    }

    if (session.expiredAt < new Date()) {
      return new ErrorResponse('Refresh token has expired', HttpStatus.BAD_REQUEST);
    }

    const token = new JwtService().generateJwtToken(session.staff);

    return new SuccessResponse({ accessToken: token });
  };

  logout = async (refreshToken: string): Promise<CommonResponse<{ message: string }>> => {
    // Find the session by the refresh token
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });
    // If the session is not found, throw a not found exception
    if (!session) {
      return new ErrorResponse('Invalid refresh token', HttpStatus.NOT_FOUND);
    }
    // Set the session as revoked
    session.revoked = true;

    await this.sessionRepository.save(session);

    return new SuccessResponse({ message: 'Logout successful' });
  };

  /**
   * Send a password reset email to the staff
   * @param email The email of the staff
   * @param frontendUrl
   * @param PasswordResetRequestDto
   * @returns A Promise that resolves to a CommonResponse object containing a success message.
   *          If the staff is not found, it returns an ErrorResponse with a NOT_FOUND status.
   */
  passwordReset = async (PasswordResetRequestDto: PasswordResetRequestDto): Promise<CommonResponse> => {
    try {
      const { email, frontendUrl } = PasswordResetRequestDto;
      const finalFrontendUrl = frontendUrl || process.env.FE_URL;

      // Find the staff by the email
      const staff = await this.staffRepository.findOne({
        where: {
          baseUser: {
            email: email.toLowerCase(),
          },
        },
        relations: ['baseUser'],
      });

      // If the staff is not found, throw a not found exception
      if (!staff) {
        return new ErrorResponse('Staff not found', HttpStatus.NOT_FOUND);
      }

      const userName = staff.baseUser.name || 'Người dùng';

      const existingToken = await this.passwordResetTokenRepository.findOne({
        where: {
          staffId: staff.id,
          expiredAt: MoreThan(new Date()),
          revoked: false,
        },
        relations: ['staff.baseUser'],
      });

      if (existingToken) {
        return new SuccessResponse();
      }

      const newPasswordResetToken = this.passwordResetTokenRepository.create({
        passwordResetToken: generatePasswordResetToken(),
        staffId: staff.id,
        expiredAt: new Date(Date.now() + 1000 * 60 * 15), //15
        staff,
      });

      // Save the new password reset token
      await this.passwordResetTokenRepository.save(newPasswordResetToken);

      const resetLink = `${finalFrontendUrl}/reset-password?passwordResetToken=${newPasswordResetToken.passwordResetToken}`;

      await this.emailService.sendEmailWithTemplate(email, 'Password Reset', resetLink, userName);

      return new SuccessResponse({
        message: 'Password reset email sent successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      return new ErrorResponse((error as Error)?.message || 'Something went wrong', HttpStatus.BAD_REQUEST);
    }
  };

  /**
   * Verify a password reset token
   *
   * @param token The password reset token
   * @param PasswordResetVerifyDto
   * @returns A Promise that resolves to an object containing a success message and status
   *          If the password reset token is not found or expired, the Promise rejects with a HttpException
   */
  verifyResetToken = async (
    PasswordResetVerifyDto: PasswordResetVerifyDto,
  ): Promise<CommonResponse<Omit<StaffType, 'password'>>> => {
    try {
      // Find the password reset token by the token
      const passwordResetToken = await this.passwordResetTokenRepository.findOne({
        where: { passwordResetToken: PasswordResetVerifyDto.token },
        relations: ['staff.baseUser'],
      });

      // If the password reset token is not found, return an error message and status false
      if (!passwordResetToken) {
        return new ErrorResponse('Invalid password reset token', HttpStatus.BAD_REQUEST);
      }

      // if the password reset token is expired, return an error message and status false
      if (passwordResetToken.expiredAt < new Date()) {
        return new ErrorResponse('Password reset token has expired', HttpStatus.BAD_REQUEST);
      }

      // if the password reset token is revoked, return an error message and status false
      if (passwordResetToken.revoked) {
        return new ErrorResponse('Password reset token has been revoked', HttpStatus.BAD_REQUEST);
      }

      return new SuccessResponse(omit(passwordResetToken.staff, 'password'));
    } catch (error) {
      return new ErrorResponse((error as Error)?.message || 'Something went wrong', HttpStatus.BAD_REQUEST);
    }
  };

  /**
   * Reset the password of a user using a password reset token
   * @param email The email of the user
   * @param password The new password
   * @param token The password reset token
   * @param PasswordResetCreateDto
   * @returns A message indicating the password has been reset
   * @throws {HttpException} If the password reset token is invalid, expired, or revoked
   */
  resetPassword = async (PasswordResetCreateDto: PasswordResetCreateDto): Promise<CommonResponse> => {
    try {
      const resetToken = await this.passwordResetTokenRepository.findOne({
        where: { passwordResetToken: PasswordResetCreateDto.token },
        relations: ['staff.baseUser'],
      });

      // If the password reset token is not found, throw a not found exception
      if (!resetToken) {
        return new ErrorResponse('Invalid password reset token', HttpStatus.NOT_FOUND);
      }

      // If the password reset token is expired, throw a bad request exception
      if (resetToken.expiredAt < new Date()) {
        return new ErrorResponse('Password reset token has expired', HttpStatus.BAD_REQUEST);
      }

      // If the password reset token is revoked, throw a bad request exception
      if (resetToken.revoked) {
        return new ErrorResponse('Password reset token has been revoked', HttpStatus.BAD_REQUEST);
      }

      const staff = resetToken.staff;

      if (staff.baseUser.email.toLowerCase() !== PasswordResetCreateDto.email.toLowerCase()) {
        return new ErrorResponse('Email does not match', HttpStatus.BAD_REQUEST);
      }

      // Hash the new password
      const isOldPassword = await bcrypt.compare(PasswordResetCreateDto.password, staff.password);

      if (isOldPassword) {
        return new ErrorResponse('New password cannot be the same as the old password', HttpStatus.BAD_REQUEST);
      }

      // Revoke the password reset token
      resetToken.revoked = true;
      await this.passwordResetTokenRepository.save(resetToken);

      const hashPassword = await new JwtService().generateHashedPassword(PasswordResetCreateDto.password);

      // Update the staff password
      staff.password = hashPassword;
      await this.staffRepository.save(staff);

      return new SuccessResponse({ message: 'Password reset successfully', status: HttpStatus.OK });
    } catch (error) {
      return new ErrorResponse((error as Error)?.message || 'Something went wrong', HttpStatus.BAD_REQUEST);
    }
  };
}
