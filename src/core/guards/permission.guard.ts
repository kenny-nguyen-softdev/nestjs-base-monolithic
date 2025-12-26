import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { RolePermission } from 'src/role-permission/entities/role-permission.entity';
import { UserPermission } from 'src/user-permission/entities/user-permission.entity';

import { Repository, In } from 'typeorm';
import { PERMISSION_KEY } from '../utils/permission.utils';
import { Permission } from 'src/permission/entities/permission.entity';
import { ExpressRequest } from '../types/express-request.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  /**
   *
   * @param reflector
   * @param permissionRepository
   * @param userPermissionRepository
   * @param rolePermissionRepository
   */
  constructor(
    private reflector: Reflector,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  /**
   * The method checks if the user has the required permission to access the
   * route/controller method.
   *
   * @param context The execution context.
   * @returns A boolean indicating if the user has the required permission.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string[]>(PERMISSION_KEY, context.getHandler());

    // If the required permission is not set, return true
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ExpressRequest>();

    const user = request.staff;

    if (!user?.roleId) {
      throw new ForbiddenException('Access denied');
    }

    // If the user is not logged in, throw a ForbiddenException
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // Find the permissions with the required keys
    const permissions = await this.permissionRepository.find({
      where: {
        key: In(requiredPermission),
      },
    });

    // If no permissions are found, throw a ForbiddenException
    if (!permissions) {
      throw new ForbiddenException('Access denied');
    }

    // Find the user permissions and the role permissions
    const [userPermissions, rolePermissions] = await Promise.all([
      this.userPermissionRepository.find({
        where: {
          userId: user.id,
          permissionId: In(permissions.map((perm) => perm.id)),
        },
      }),
      this.rolePermissionRepository.find({
        where: {
          roleId: user.role.id,
          permissionId: In(permissions.map((perm) => perm.id)),
        },
      }),
    ]);

    // If the user or the role has the required permission, return true
    // If not, throw a ForbiddenException
    if (!userPermissions.length && !rolePermissions.length) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
