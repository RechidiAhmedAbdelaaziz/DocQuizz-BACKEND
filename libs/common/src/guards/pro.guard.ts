import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { HttpAuthGuard } from './auth.guard';
import { UserRoles } from '../shared';

@Injectable()
export class ProGuard extends HttpAuthGuard implements CanActivate {

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        super.canActivate(context)

        const request = context.switchToHttp().getRequest<Request>()

        if (!request.user.isPro) throw new HttpException('Unauthorized -USE PRO PLAN-', 401)

        return true;
    }
}
