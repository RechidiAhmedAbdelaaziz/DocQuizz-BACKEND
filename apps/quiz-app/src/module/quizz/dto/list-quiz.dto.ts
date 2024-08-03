import { PaginationParamsDTO } from "@app/common/utils/pagination-helper";
import { IsMongoId, IsOptional, IsString, IsBoolean, IsEnum, IsNumber } from "class-validator";
import { Types } from "mongoose";

export class ListQuizQuery extends PaginationParamsDTO {

    @IsOptional()
    @IsMongoId({ each: true })
    fields?: Types.ObjectId[];

    @IsOptional()
    @IsMongoId({ each: true })
    courses?: Types.ObjectId[];

    @IsOptional()
    @IsMongoId({ each: true })
    references?: Types.ObjectId[];

    @IsOptional()
    @IsEnum(["Easy", "Medium", "Hard"], { each: true })
    difficulties?: ("Easy" | "Medium" | "Hard")[]

    @IsOptional()
    @IsEnum(['QCM', 'QCU'], { each: true })
    types?: ('QCM' | 'QCU')[]

    @IsOptional()
    @IsBoolean()
    withExplanation?: boolean

    @IsOptional()
    @IsBoolean()
    withNotes?: boolean

    @IsOptional()
    @IsNumber({}, { each: true })
    years?: number[]






}