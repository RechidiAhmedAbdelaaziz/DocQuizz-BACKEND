import { PaginationQuery } from "@app/common/utils/pagination";
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";



export class ListQuestionsQuery extends PaginationQuery {
    @IsOptional()
    @IsEnum(['QCM', 'QCU'], { each: true })
    types?: ('QCM' | 'QCU')[];

    @IsOptional()
    @IsEnum(['easy', 'medium', 'hard'], { each: true })
    difficulties?: ('easy' | 'medium' | 'hard')[];

    @IsOptional()
    @IsMongoId()
    examId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId({ each: true })
    courses?: Types.ObjectId[];

    @IsOptional()
    @IsBoolean()
    withExplanation?: boolean;

    @IsOptional()
    @IsString()
    keywords?: string;

    @IsOptional()
    @IsMongoId({ each: true })
    sources?: Types.ObjectId[];

    @IsOptional()
    @IsNumberString({})
    year?: string;

}

// ?

