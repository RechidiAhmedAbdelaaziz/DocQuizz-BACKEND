import { IsNumber, IsString } from "class-validator"

export class CreateExamBody {

    @IsString()
    major: string

    @IsNumber()
    time: number

    @IsNumber()
    year: number

    @IsString()
    city: string
}

 // {"major":"Math","time":120,"year":2021,"city":"Hanoi"}