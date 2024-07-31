import { IsOptional, IsString } from "class-validator";

export class UpdateCourseBody {

    @IsOptional()
    @IsString()
    title: string;
}