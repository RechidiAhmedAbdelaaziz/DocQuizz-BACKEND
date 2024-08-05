import { IsName } from "@app/common";
import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateUserBody {
    @IsOptional()
    @IsName()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Speciality)
    speciality?: {
        domain: string;
        level: string;
        faculty: string;
    }
}

class Speciality {
    @IsString()
    domain: string;

    @IsString()
    level: string;

    @IsString()
    faculty: string;
}