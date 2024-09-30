import { IsString, IsEnum, IsOptional, ArrayNotEmpty, IsBoolean, ArrayMaxSize, IsNumber, IsMongoId } from "class-validator";
import { Types } from "mongoose";



export class CreateQuizBody {

    @IsString()
    title: string;

    @IsMongoId({ each: true })
    @ArrayNotEmpty()
    courses: Types.ObjectId[]

    @IsOptional()
    @IsEnum(["easy", "medium", "hard"], { each: true })
    @ArrayMaxSize(3)
    difficulties?: ("easy" | "medium" | "hard")[]

    @IsOptional()
    @IsEnum(["QCM", "QCU", "Cas Clinique"], { each: true })
    @ArrayMaxSize(2)
    types?: ("QCM" | "QCU" | "Cas Clinique")[]

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
    @IsNumber()
    year?: number


}

// {"title" : "test", "courses" : ["5f9b1b3b1c9d440000f4b3b4"], "difficulties" : ["easy", "medium", "hard"], "types" : ["QCM", "QCU"], "alreadyAnsweredFalse" : true, "withExplanation" : true, "withNotes" : true, "sources" : ["5f9b1b3b1c9d440000f4b3b4"], "years" : [2020, 2021]}