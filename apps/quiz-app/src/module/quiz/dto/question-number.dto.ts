import { Type } from "class-transformer";
import { IsString, ValidateNested, IsEnum, IsOptional, ArrayNotEmpty, IsBoolean, ArrayMaxSize, IsNumber, IsNumberString } from "class-validator";

class Field {

    @IsString()
    level: string

    @IsString()
    major: string

    @IsString()
    course: string
}

export class QuestionsNumberQuery {


    @ValidateNested({ each: true })
    @Type(() => Field)
    @ArrayNotEmpty()
    fields: Field[]

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
    @IsString({ each: true })
    sources?: string[]

    @IsOptional()
    @IsNumberString({}, { each: true })
    years?: string[]


}