import { PaginationQuery } from "@app/common/utils/pagination";
import { IsOptional, IsString } from "class-validator";

export class ListExamQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keys: string
}