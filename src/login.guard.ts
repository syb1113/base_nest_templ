import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import _ from 'lodash';
interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  // 注入 Reflector，用于获取自定义装饰器的元数据
  @Inject()
  private reflector: Reflector;

  // 注入 JwtService，用于解析和验证 JWT Token
  @Inject()
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 从上下文中获取 HTTP 请求对象
    const request: Request = context.switchToHttp().getRequest();

    /**
     * 从控制器类和方法上读取“require-login”元数据
     * 这个元数据通常通过 @RequireLogin() 装饰器设置
     */
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getClass(), context.getHandler()],
    );

    // 如果该路由没有设置“需要登录”，则直接放行
    if (!requireLogin) {
      return true;
    }

    // 获取请求头中的 Authorization 字段
    const authorization = request.headers.authorization;

    // 如果请求头中没有携带 token，则抛出未登录异常
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      /**
       * 一般 Authorization 格式为：Bearer <token>
       * 所以通过空格分割后，第二项即为 token
       */
      const [, token] = authorization.split(' ');
      console.log('token', token);

      // 使用 JwtService 验证 token 的有效性并解码
      const data = this.jwtService.verify<JwtUserData>(token);

      // 深拷贝用户数据到 request.user，防止被篡改
      request.user = _.cloneDeep(data);

      // 验证通过，放行请求
      return true;
    } catch (e) {
      // 如果 token 验证失败或过期，抛出异常
      console.log(e);
      throw new UnauthorizedException('token失效 请重新登录');
    }
  }
}
