import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtPayload } from "..";


export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user;
});