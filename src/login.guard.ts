import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
declare module 'express' {
  interface Request {
    username: string;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data: Request = this.jwtService.verify(token);
      const newToken = this.jwtService.sign(
        { username: data.username },
        { expiresIn: '7d' },
      );
      response.setHeader('Authorization', 'Bearer ' + newToken);

      request.username = data.username;

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
