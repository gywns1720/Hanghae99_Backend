import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { IResponseData } from '@lib/common/type';
import { Response } from 'express';
import * as process from 'node:process';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    try {
      if (exception instanceof BadRequestException) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('CustomErrorFilter', exception);
        }
        const exceptionRes = exception.getResponse() as {
          message: string[];
          error: string;
          statusCoed: number;
        };

        const message = Array.isArray(exceptionRes.message)
          ? exceptionRes.message.length > 0
            ? exceptionRes.message[0]
            : ''
          : exceptionRes.message;

        res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          code: 4000,
          message,
          payload: null,
        } as IResponseData);
      }
    } catch (err) {
      console.error('BadRequestFilter Catch', err);
    }
  }
}
