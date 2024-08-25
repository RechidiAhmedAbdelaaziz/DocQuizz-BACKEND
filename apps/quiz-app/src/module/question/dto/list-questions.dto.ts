import { PaginationQuery } from "@app/common/utils/pagination";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

class Field {
    @IsString()
    level: string;

    @IsString()
    major: string;

    @IsString()
    course: string;
}

export class ListQuestionsBody {
    @IsOptional()
    @IsEnum(['QCM', 'QCU'], { each: true })
    types?: ('QCM' | 'QCU')[];

    @IsOptional()
    @IsEnum(['easy', 'medium', 'hard'], { each: true })
    difficulties?: ('easy' | 'medium' | 'hard')[];

    @IsOptional()
    @IsMongoId()
    source?: Types.ObjectId;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Field)
    fields?: Field[];

    @IsOptional()
    @IsBoolean()
    withExplanation?: boolean;

}


export class ListQuestionsQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keywords?: string;
}