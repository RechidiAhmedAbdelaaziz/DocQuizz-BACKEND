import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber } from "class-validator";
import { Types } from "mongoose";


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

    @IsMongoId()
    courseId: Types.ObjectId;

    @IsOptional()
    @IsString()
    explanation?: string;

    @IsOptional()
    @IsMongoId()
    sourceId?: Types.ObjectId;

    @IsOptional()
    @IsNumber()
    year?: number;
}

// {"questionText":"What is the capital of Nigeria?","correctAnswers":["Abuja"],"wrongAnswers":["Lagos","Kano","Ibadan"],"difficulty":"easy","course":"General Knowledge"}