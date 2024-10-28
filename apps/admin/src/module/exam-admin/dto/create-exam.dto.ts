import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateExamBody {

    @IsOptional()
    @IsMongoId()
    majorId: Types.ObjectId

    @IsNumber()
    time: number

    @IsNumber()
    year: number

    @IsString()
    city: string

    @IsEnum(['Externat ', 'Résidanat', 'Résidanat blanc', 'Ratrappage'], { message: 'type must be one of these values: Externat, Résidanat, Résidanat blanc, Ratrappage' })
    type: string

    @IsOptional()
    @IsString()
    group: string

}

