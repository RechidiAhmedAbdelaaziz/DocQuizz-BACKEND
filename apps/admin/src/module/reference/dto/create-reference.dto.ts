import { IsOptional, IsString } from "class-validator";

export class CreateReferenceDto {
    @IsString()
    title: string;
}

export class UpdateReferenceDto {
    @IsOptional()
    @IsString()
    title: string;
}