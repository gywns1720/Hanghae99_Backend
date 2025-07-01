import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomError } from '@lib/common';
import * as process from 'node:process';
import { Response } from 'express';

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    try {
      if (exception instanceof CustomError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('CustomErrorFilter', exception);
        }
        const toExceptionObject = exception.toObject;
        res.status(toExceptionObject.status).json(toExceptionObject);
      }
    } catch (err) {
      console.error('CustomErrorFilter Catch', err);
    }
  }
}
