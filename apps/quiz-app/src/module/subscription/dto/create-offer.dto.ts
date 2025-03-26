import { IsMongoId, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateOfferBody {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsMongoId({ each: true })
    levels: Types.ObjectId[];

    @IsMongoId()
    domainId: Types.ObjectId;

    @IsNumber()
    price: number;


}