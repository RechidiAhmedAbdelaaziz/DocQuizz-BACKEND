import { PaginationQuery } from "@app/common/utils/pagination-helper";
import { IsOptional, IsString } from "class-validator";

export class ListPlaylistQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    keywords?: string
}