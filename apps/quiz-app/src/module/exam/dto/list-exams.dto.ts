import { PaginationQuery } from "@app/common/utils/pagination-helper";
import { IsOptional, IsString } from "class-validator";

export class ListExamQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keys: string
}