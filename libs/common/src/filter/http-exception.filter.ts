import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { isArray, isString } from 'class-validator';
import { Request, Response } from 'express';

interface ErrorObject {
  sucess: false
  status: number
  message: string
  stack?: string
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();


    const message =
      isString(error) ?
        error :
        isArray(error['message']) ? error['message'][0] : error['message'];

    const errorResponse: ErrorObject = {
      sucess: false,
      status,
      message,
      stack: exception.stack
    }

    if (process.env.NODE_ENV === 'development') {
      throwDevlopmentError(response, errorResponse)
    } else {
      throwProductionError(response, errorResponse)
    }

  }
}



const throwDevlopmentError = (res: Response, error: ErrorObject) => {
  const { sucess, status, message, stack } = error;
  res.status(status).json({
    sucess,
    status,
    message,
    stack
  })
}


const throwProductionError = (res: Response, error: ErrorObject) => {
  const { sucess, status, message } = error;
  res.status(status).json({
    sucess,
    status,
    message
  })
}

