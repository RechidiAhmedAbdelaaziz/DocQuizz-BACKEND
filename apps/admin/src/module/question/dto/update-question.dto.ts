import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber } from "class-validator";
import { Types } from "mongoose";



export class UpdateQuestionBody {

    @IsOptional()
    @IsString()
    questionText: string

    @IsOptional()
    @ArrayNotEmpty()
    @IsString({ each: true })
    correctAnswers: string[]

    @IsOptional()
    @IsString({ each: true })
    wrongAnswers: string[]

    @IsOptional()
    @IsEnum(["easy", "medium", "hard"])
    difficulty: "easy" | "medium" | "hard"

    @IsOptional()
    @IsOptional()
    @IsMongoId()
    examId?: Types.ObjectId

    @IsMongoId()
    courseId: Types.ObjectId

    @IsOptional()
    @IsString()
    explanation?: string

    @IsOptional()
    @IsMongoId()
    sourceId?: Types.ObjectId

    @IsOptional()
    @IsNumber()
    year?: number
}

