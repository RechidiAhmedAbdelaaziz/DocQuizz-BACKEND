import { IsString } from "class-validator";

export class ListCoursesQuery {
    @IsString()
    level: string;

    @IsString()
    major: string;
}