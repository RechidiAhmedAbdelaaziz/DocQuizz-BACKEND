import { PaginationParamsDTO } from "@app/common/utils/pagination-helper";
import { IsOptional, IsString } from "class-validator";

export class ListExamQuery extends PaginationParamsDTO {
    @IsOptional()
    @IsString()
    keys: string
}