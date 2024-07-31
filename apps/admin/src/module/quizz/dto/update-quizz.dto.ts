import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { Schema } from "mongoose";


export class UpdateQuizzBody {
    @IsOptional()
    @IsString()
    question: string

    @Type(() => AnswerDTO)
    answers: {
        answer: string,
        isCorrect: boolean,
        explication?: string
    }[]

    @IsOptional()
    @IsEnum(["Very Easy", "Easy", "Medium", "Hard", "Very Hard"], { message: 'Invalid difficulty' })
    difficulty: "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard"

    @IsOptional()
    @IsMongoId()
    fieldId: Schema.Types.ObjectId
}


class AnswerDTO {
    @IsString()
    answer: string


    @IsBoolean()
    isCorrect: boolean

    @IsOptional()
    @IsString()
    explication?: string
}