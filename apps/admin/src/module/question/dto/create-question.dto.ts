import { Difficulty } from "@app/common";
import { Type } from "class-transformer";
import { IsString, IsMongoId, IsEnum, IsOptional, ArrayNotEmpty, ValidateNested, IsNumber, IsBoolean } from "class-validator";
import { Types } from "mongoose";


export class Answer {
    @IsString()
    text: string

    @IsBoolean()
    isCorrect: boolean
}

export class SubQuestion {
    @IsString()
    text: string

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Answer)
    answers: Answer[]

    @IsEnum(['easy', 'medium', 'hard'])
    difficulty: Difficulty

    @IsOptional()
    @IsString()
    explanation?: string
}

class Source_Year {
    @IsMongoId()
    sourceId: Types.ObjectId

    @IsNumber()
    year: number
}

export class CreateOrUpdateQuestionBody {
    @IsString()
    @IsOptional()
    caseText?: string

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => SubQuestion)
    questions: SubQuestion[]

    @IsMongoId()
    @IsOptional()
    examId?: Types.ObjectId

    @IsMongoId()
    courseId: Types.ObjectId

    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Source_Year)
    sources: Source_Year[] 



}

// {"caseText":"case text","questions":[{"text":"question text","answers":[{"text":"answer text","isCorrect":true},{"text":"answer text","isCorrect":false}],"difficulty":"easy","explanation":"explanation"}],"examId":"5f9b3b3b1f3b3b3b3b3b3b3","courseId":"5f9b3b3b1f3b3b3b3b3b3b3","sources":[{"sourceId":"5f9b3b3b1f3b3b3b3b3b3b3","year":2020}]}