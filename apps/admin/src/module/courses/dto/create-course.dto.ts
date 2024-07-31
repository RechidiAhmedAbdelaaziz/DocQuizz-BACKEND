import { IsString } from "class-validator";

export class CreateCourseBody {
    @IsString()
    title: string;
}