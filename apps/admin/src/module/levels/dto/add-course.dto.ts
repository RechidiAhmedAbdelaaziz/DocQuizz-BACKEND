import { IsString } from "class-validator"

export class AddCourseBody {
    @IsString()
    level: string

    @IsString()
    major: string

    @IsString()
    name: string
}