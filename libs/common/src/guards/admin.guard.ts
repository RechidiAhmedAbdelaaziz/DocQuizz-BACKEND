import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HttpAuthGuard } from './auth.guard';
import { UserRoles } from '../shared';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard extends HttpAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    super.canActivate(context)

    const reflector = new Reflector();
    const skipAdminGuard = reflector.get<boolean>('skipAdminGuard', context.getHandler());
    if (skipAdminGuard) return ModeratorGuard.prototype.canActivate(context)


    const request = context.switchToHttp().getRequest<Request>()

    if (request.user.role !== UserRoles.ADMIN
      && request.user.role !== UserRoles.SUPER_ADMIN
    ) throw new HttpException('Tu n\'es pas admin', 403)

    return true;
  }
}


@Injectable()
class ModeratorGuard extends HttpAuthGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const request = context.switchToHttp().getRequest<Request>()

    if (request.user.role !== UserRoles.MODERATOR
      && request.user.role !== UserRoles.ADMIN && request.user.role !== UserRoles.SUPER_ADMIN
    ) throw new HttpException('Tu n\'es pas modérateur', 403)

    return true;
  }
}

@Injectable()
export class SuperAdminGuard extends HttpAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    super.canActivate(context)

    const request = context.switchToHttp().getRequest<Request>()

    if (request.user.role !== UserRoles.SUPER_ADMIN) throw new HttpException('Tu n\'es pas super admin', 403)

    return true;
  }
}