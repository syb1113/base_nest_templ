import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'require-permission',
      [context.getClass(), context.getHandler()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const permissionSet = new Set(permissions.map((p) => p.code));
    const hasAll = requiredPermissions.every((code: string) =>
      permissionSet.has(code),
    );
    if (!hasAll) {
      throw new UnauthorizedException('您没有访问该接口的权限');
    }

    return true;
  }
}
