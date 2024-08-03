import { IsName } from "@app/common";
import { PaginationParamsDTO } from "@app/common/utils/pagination-helper";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class ListFieldsQuery extends PaginationParamsDTO {

    @IsOptional()
    @IsName()
    name: string

    @IsOptional()
    @IsNumber({}, { each: true })
    @Transform(({ value }) => value.split(',').map(Number))
    years: number[]


}