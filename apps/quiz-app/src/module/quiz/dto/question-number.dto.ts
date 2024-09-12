import {  IsEnum, IsOptional, ArrayNotEmpty, IsBoolean, ArrayMaxSize, IsNumber, IsNumberString, IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class QuestionsNumberQuery {


    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    courses: Types.ObjectId[]

    @IsOptional()
    @IsEnum(["easy", "medium", "hard"], { each: true })
    @ArrayMaxSize(3)
    difficulties?: ("easy" | "medium" | "hard")[]

    @IsOptional()
    @IsEnum(["QCM", "QCU"], { each: true })
    @ArrayMaxSize(2)
    types?: ("QCM" | "QCU")[]

    @IsOptional()
    @IsBoolean()
    alreadyAnsweredFalse?: boolean

    @IsOptional()
    @IsBoolean()
    withExplanation?: boolean

    @IsOptional()
    @IsBoolean()
    withNotes?: boolean

    @IsOptional()
    @IsMongoId({ each: true })
    sources?: Types.ObjectId[]

    @IsOptional()
    @IsNumberString({}, { each: true })
    years?: string[]


}

