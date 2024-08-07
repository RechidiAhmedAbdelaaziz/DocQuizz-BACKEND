import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty } from "class-validator";
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

    @IsString()
    course: string

    @IsOptional()
    @IsString()
    explanation?: string
}

// {"questionText":"What is the capital of Nigeria?","correctAnswers":["Abuja"],"wrongAnswers":["Lagos","Kano","Ibadan"],"difficulty":"easy","course":"General Knowledge"}