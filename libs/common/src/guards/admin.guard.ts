import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HttpAuthGuard } from './auth.guard';
import { UserRoles } from '../shared';

@Injectable()
export class AdminGuard extends HttpAuthGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    super.canActivate(context)

    const request = context.switchToHttp().getRequest<Request>()

    if (request.user.role !== UserRoles.ADMIN) throw new HttpException('Unauthorized -NOT_ADMIN-', 401)

    return true;
  }
}
