import { PaginationQuery } from "@app/common/utils/pagination";
import { IsOptional, IsString } from "class-validator";

export class ListQuizQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keywords?: string
}