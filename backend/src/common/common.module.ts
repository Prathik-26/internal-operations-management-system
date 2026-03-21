import { Module, Global } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [RequestContextService, LoggingInterceptor],
  exports: [RequestContextService, LoggingInterceptor],
})
export class CommonModule {}
