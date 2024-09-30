import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { Types } from "mongoose"

class QuestionAnswer {
    @IsMongoId()
    questionId: Types.ObjectId

    @IsBoolean({ each: true })
    isCorrect: boolean[]

    @IsNumber()
    time: number

    @IsArray({ each: true })
    choices: number[][]
}

export class UpdateQuizBody {
    @IsString()
    @IsOptional()
    title?: string

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean

    @IsNumber()
    @IsOptional()
    time?: number

    @IsOptional()
    @ValidateNested()
    @Type(() => QuestionAnswer)
    questionAnswer?: QuestionAnswer

    @IsNumber()
    @IsOptional()
    lastAnsweredIndex?: number
}

// {"title":"string","isCompleted":true,"time":1,"questionAnswer":{"questionId":"string","isCorrect":true}}