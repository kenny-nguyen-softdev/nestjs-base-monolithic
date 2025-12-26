import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Staff } from '../staff/entities/staff.entity';
import { Session } from 'src/session/entities/session.entity';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { PasswordResetToken } from 'src/password-reset/entities/password-reset.entity';

import { RolePermission } from 'src/role-permission/entities/role-permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';
import { Permission } from 'src/permission/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Session, PasswordResetToken, Role, Permission, UserPermission, RolePermission]),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
