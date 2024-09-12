import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber } from "class-validator";
import { Types } from "mongoose";



class FieldDto {
    @IsString()
    level: string;

    @IsString()
    major: string;

    @IsString()
    course: string;

}

export class CreateQuestionBody {
    @IsString()
    questionText: string;

    @ArrayNotEmpty()
    @IsString({ each: true })
    correctAnswers: string[];

    @IsString({ each: true })
    wrongAnswers: string[];

    @IsEnum(["easy", "medium", "hard"])
    difficulty: "easy" | "medium" | "hard";

    @IsOptional()
    @IsMongoId()
    examId?: Types.ObjectId;

    @ValidateNested()
    @Type(() => FieldDto)
    field: FieldDto;

    @IsOptional()
    @IsString()
    explanation?: string;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsNumber()
    year?: number;
}

// {"questionText":"What is the capital of Nigeria?","correctAnswers":["Abuja"],"wrongAnswers":["Lagos","Kano","Ibadan"],"difficulty":"easy","course":"General Knowledge"}