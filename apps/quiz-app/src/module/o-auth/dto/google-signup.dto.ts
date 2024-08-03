import { IsOptional, IsString } from "class-validator";

export class GoogleAuthQuery {

    @IsString()
    code: string;

    @IsOptional()
    scope: string;

    @IsOptional()
    authuser: string;

    @IsOptional()
    prompt: string;
}