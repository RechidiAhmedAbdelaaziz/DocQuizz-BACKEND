import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response {
  tokens?: { refreshToken: string, accessToken: string }
  message?: string
  user?: any
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: Response) => this.responseHandler(res, context)),
    );
  }



  responseHandler(data: Response, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;


    const { tokens, message, user } = data;
    data.tokens = undefined;
    data.message = undefined;





    return {
      sucess: true,
      statusCode,
      message,
      tokens,
      data: user || data
    }
  }
}

