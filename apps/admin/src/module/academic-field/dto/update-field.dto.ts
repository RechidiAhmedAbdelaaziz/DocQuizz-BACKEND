import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateFieldBody {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEnum([1, 2, 3, 4, 5, 6, 7], { message: 'Year must be 1 to 7' })
    year: number;

    @IsOptional()
    @IsEnum([1, 2], { message: 'Semester must be 1 or 2' })
    semester: number;
}