import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const code = data.code ?? 1;
        delete data.code;
        return {
          code,
          statusCode: 200,
          message: code ? 'success' : 'fail',
          data: data,
        };
      }),
    );
  }
}
