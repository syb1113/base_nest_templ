/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import * as requestIp from 'request-ip';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Request>();

    const userAgent = request.headers['user-agent'];

    const { method, path } = request;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clientIp = requestIp.getClientIp(request) || request.ip;

    this.logger.log(
      `${method} ${path} ${clientIp} ${userAgent} : ${context.getClass().name} ${context.getHandler().name} invoked`,
    );

    const start = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.log(
          `${method} ${path} ${clientIp} ${userAgent}:${response.statusCode} : ${Date.now() - start}ms`,
        );

        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
