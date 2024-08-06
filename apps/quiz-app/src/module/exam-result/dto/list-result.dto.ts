import { PaginationParamsDTO } from "@app/common/utils/pagination-helper";
import { IsOptional, IsString } from "class-validator";

export class ListResultQuery extends PaginationParamsDTO {

    @IsOptional()
    @IsString()
    keywords?: string;

}