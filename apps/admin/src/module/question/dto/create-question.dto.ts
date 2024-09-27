import { Question } from "@app/common/models";
import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber, IsBoolean } from "class-validator";
import { Types } from "mongoose";


export class QuestionAnswer {

    @IsString()
    text: string;

    @IsBoolean()
    isCorrect: boolean;

    
}

export class CreateQuestionBody {
    @IsString()
    questionText: string;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => QuestionAnswer)
    answers: QuestionAnswer[];
    //

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