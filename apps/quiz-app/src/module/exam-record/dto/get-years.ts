import { Type } from "class-transformer"
import { IsEnum, IsMongoId, IsOptional, IsString, ValidateNested } from "class-validator"
import { Types } from "mongoose"


class _Domain {
    @IsMongoId()
    domainId: Types.ObjectId

    @IsEnum(['Résidanat', 'Résidanat blanc'])
    type: 'Résidanat' | 'Résidanat blanc'
}

export class GetYearsQuery {
    @IsOptional()
    @IsMongoId()
    majorId: Types.ObjectId

    @IsOptional()
    @ValidateNested()
    @Type(() => _Domain)
    domain: _Domain
}