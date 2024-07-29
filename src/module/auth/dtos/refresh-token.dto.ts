import { IsString } from "class-validator";

export class RefreshTokenQuery {
    @IsString()
    refreshToken: string
}