import { IsNumber, IsString } from "class-validator"

export class CreateExamBody {
    
    @IsString()
    title: string

    @IsNumber()
    time: number
}