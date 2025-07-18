import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IResponseData } from '@lib/common/type';

/**
 * 응답 결과를 수행할 때 사용하는 인터셉터
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          code: data?.code || 2000,
          message: data?.message || 'SUCCESS',
          payload: data,
          status: HttpStatus.OK,
        } as IResponseData;
      }),
    );
  }
}
