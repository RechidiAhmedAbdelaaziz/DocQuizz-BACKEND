import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty } from "class-validator";
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
    source?: Types.ObjectId

    @IsOptional()
    @IsString()
    course: string

    @IsOptional()
    @IsString()
    explanation?: string
}