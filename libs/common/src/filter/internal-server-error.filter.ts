import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

import { IResponseData } from '@lib/common/type';
import { Response } from 'express';
import * as process from 'node:process';
@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    try {
      if (exception instanceof InternalServerErrorException) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('CustomErrorFilter', exception);
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 5000,
          message: exception.message,
          payload: null,
        } as IResponseData);
      }
    } catch (err) {
      console.error('InternalServerErrorException Catch', err);
    }
  }
}
