import { IsNumber } from "class-validator";

export class UpdateResultBody {
    @IsNumber()
    answerd: number

    @IsNumber()
    correct: number
}