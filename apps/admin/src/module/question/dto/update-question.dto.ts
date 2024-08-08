import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested } from "class-validator";
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
    source?: Types.ObjectId

    @IsOptional()
    @ValidateNested()
    @Type(() => FieldDto)
    field: FieldDto

    @IsOptional()
    @IsString()
    explanation?: string
}

