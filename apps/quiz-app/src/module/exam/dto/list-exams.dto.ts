import { PaginationQuery } from "@app/common/utils/pagination";
import { IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class ListExamQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keywords: string

    @IsOptional()
    @IsMongoId()
    major: Types.ObjectId
}