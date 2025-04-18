import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response {
  tokens?: { refreshToken: string, accessToken: string }
  message?: string
  user?: any
  pagination?: { page?: number; length?: number; next?: number; prev?: number },
  object: any,
  data?: any
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


    const { tokens, message, pagination, data, object } = response;
    response.message = undefined
    response.tokens = undefined

    // check if data == {}
    const dataIsEmpty = JSON.stringify(response) === JSON.stringify({})



    return {
      sucess: true,
      statusCode,
      message,
      tokens,
      pagination,
      object,
      data: data || (dataIsEmpty ? undefined : response)
    }
  }
}

