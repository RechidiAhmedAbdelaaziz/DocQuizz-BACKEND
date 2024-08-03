import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";


export class CreateQuizzBody {
    @IsString()
    question: string

    @IsString({ each: true })
    correctAnswers: string[]

    @IsString({ each: true })
    incorrectAnswers: string[]

    @IsOptional()
    @IsString()
    explanation: string

    @IsEnum(["Easy", "Medium", "Hard"], { message: 'Invalid difficulty' })
    difficulty: "Easy" | "Medium" | "Hard"

    @IsMongoId()
    fieldId: Types.ObjectId

    @IsMongoId()
    courseId: Types.ObjectId

    @IsMongoId()
    referenceId: Types.ObjectId
    @IsNumber()
    year: number

    @IsOptional()
    @IsString({ each: true })
    notes: string[]
}

