import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber } from "class-validator";
import { Types } from "mongoose";

class FieldDto {
    @IsString()
    level: string

    @IsString()
    major: string

    @IsString()
    course: string
} // {""}

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

    @IsOptional()
    @ValidateNested()
    @Type(() => FieldDto)
    field: FieldDto

    @IsOptional()
    @IsString()
    explanation?: string

    @IsOptional()
    @IsString()
    source?: string

    @IsOptional()
    @IsNumber()
    year?: number
}

