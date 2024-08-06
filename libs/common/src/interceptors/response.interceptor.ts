import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationParamsDTO } from '../utils/pagination-helper';

interface Response {
  tokens?: { refreshToken: string, accessToken: string }
  message?: string
  user?: any
  pagination?: { page?: number; length?: number; next?: number; prev?: number }
  data?: any[]
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: Response) => this.responseHandler(res, context)),
    );
  }



  responseHandler(response: Response, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;

    console.log(response)

    const { tokens, message, user, pagination, data } = response;
    response.tokens = undefined;
    response.message = undefined;



    return {
      sucess: true,
      statusCode,
      message,
      tokens,
      pagination,
      data: data || response
    }
  }
}

