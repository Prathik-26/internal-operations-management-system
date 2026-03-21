import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { RequestContextService } from './request-context.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private requestContext: RequestContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const requestId = randomUUID();
    const { method, url } = req;
    const start = Date.now();

    return new Observable((observer) => {
      this.requestContext.run({ requestId }, () => {
        this.logger.log(`[${requestId}] --> ${method} ${url}`);

        next
          .handle()
          .pipe(
            tap(() => {
              const duration = Date.now() - start;
              const status = res.statusCode;
              this.logger.log(
                `[${requestId}] <-- ${method} ${url} ${status} ${duration}ms`,
              );
            }),
          )
          .subscribe({
            next: (val) => observer.next(val),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      });
    });
  }
}
