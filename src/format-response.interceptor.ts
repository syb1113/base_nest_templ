import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor
  implements
    NestInterceptor<unknown, { code: number; message: string; data: unknown }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<{ code: number; message: string; data: unknown }> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: unknown) => ({
        code: response.statusCode,
        message: 'success',
        data,
      })),
    );
  }
}
