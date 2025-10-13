import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException extends Error {
  constructor(message?: string) {
    super(message ?? '用户未登录');
    this.name = 'UnLoginException';
    Object.setPrototypeOf(this, UnLoginException.prototype);
  }
}
@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(HttpStatus.UNAUTHORIZED)
      .json({
        code: HttpStatus.UNAUTHORIZED,
        message: 'fail',
        data: exception.message || '用户未登录',
      })
      .end();
  }
}
