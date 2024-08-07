import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested } from "class-validator";
import { Types } from "mongoose";

export class CreateQuestionBody {
    @IsString()
    questionText: string

    @ArrayNotEmpty()
    @IsString({ each: true })
    correctAnswers: string[]

    @IsString({ each: true })
    wrongAnswers: string[]

    @IsEnum(["easy", "medium", "hard"])
    difficulty: "easy" | "medium" | "hard"

    @IsOptional()
    @IsMongoId()
    source?: Types.ObjectId

    @ValidateNested()
    @Type(() => FieldDto)
    field: FieldDto

    @IsOptional()
    @IsString()
    explanation?: string
}

class FieldDto {
    @IsString()
    level: string

    @IsString()
    major: string

    @IsString()
    course: string
}
// {"questionText":"What is the capital of Nigeria?","correctAnswers":["Abuja"],"wrongAnswers":["Lagos","Kano","Ibadan"],"difficulty":"easy","course":"General Knowledge"}