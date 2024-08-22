import { JwtPayload } from '@app/common';
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request>()

    const authHeader = request.headers.authorization
    if (!authHeader) throw new HttpException('Authorization header not found', 401)

    const token = authHeader.split(' ')[1]
    if (!token) throw new HttpException('Token not found', 401)

    try {
      const payload: JwtPayload = this.jwtService.verify(token)
      request.user = payload;
    }
    catch (e) {
      throw new HttpException('Token verification failed',401, { cause: e })
    }


    return true;
  }
}
