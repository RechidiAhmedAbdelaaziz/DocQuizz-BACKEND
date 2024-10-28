import { PaginationQuery } from "@app/common/utils/pagination";
import { IsMongoId, IsNumberString, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class ListExamQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keywords: string

    @IsOptional()
    @IsMongoId()
    majorId: Types.ObjectId

    @IsOptional()
    @IsNumberString()
    year: string
}