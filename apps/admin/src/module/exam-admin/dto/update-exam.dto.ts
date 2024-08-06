import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateExamBody {

    @IsOptional()
    @IsString()
    major: string

    @IsOptional()
    @IsNumber()
    time: number

    @IsOptional()
    @IsNumber()
    year: number

    @IsOptional()
    @IsString()
    city: string
}