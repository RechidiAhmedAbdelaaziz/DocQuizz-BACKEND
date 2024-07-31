import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Schema } from "mongoose";


export class CreateQuizzBody {
    @IsString()
    question: string

    @IsString({ each: true })
    correctAnswers: string[]

    @IsString({ each: true })
    incorrectAnswers: string[]

    @IsString()
    explanation: string

    @IsEnum(["Easy", "Medium", "Hard"], { message: 'Invalid difficulty' })
    difficulty: "Easy" | "Medium" | "Hard"

    @IsMongoId()
    fieldId: Schema.Types.ObjectId

    @IsMongoId()
    courseId: Schema.Types.ObjectId

    @IsMongoId()
    referenceId: Schema.Types.ObjectId
    @IsNumber()
    year: number
}

