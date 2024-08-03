import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";


export class UpdateQuizzBody {
    @IsOptional()
    @IsString()
    question: string

    @IsOptional()
    @IsString({ each: true })
    correctAnswers: string[]

    @IsOptional()
    @IsString({ each: true })
    incorrectAnswers: string[]

    @IsOptional()
    @IsString()
    explanation: string

    @IsOptional()
    @IsEnum(["Easy", "Medium", "Hard"], { message: 'Invalid difficulty' })
    difficulty: "Easy" | "Medium" | "Hard"

    @IsOptional()
    @IsMongoId()
    fieldId: Types.ObjectId

    @IsOptional()
    @IsMongoId()
    courseId: Types.ObjectId

    @IsOptional()
    @IsMongoId()
    referenceId: Types.ObjectId

    @IsOptional()
    @IsNumber()
    year: number

    @IsOptional()
    @IsString({ each: true })
    notes: string[]
}


