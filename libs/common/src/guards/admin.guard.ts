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

    if (request.user.role !== UserRoles.ADMIN) throw new HttpException('Tu n\'es pas admin', 401)

    return true;
  }
}


@Injectable()
export class ModeratorGuard extends HttpAuthGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    super.canActivate(context)

    const request = context.switchToHttp().getRequest<Request>()

    if (request.user.role !== UserRoles.MODERATOR
      && request.user.role !== UserRoles.ADMIN
    ) throw new HttpException('Tu n\'es pas modérateur', 401)

    return true;
  }
}