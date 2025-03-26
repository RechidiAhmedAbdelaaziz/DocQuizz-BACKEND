import { IsMongoId } from "class-validator";
import { Types } from "mongoose";


export class CreateSubDTO {
    @IsMongoId()
    userId: Types.ObjectId;

    

    @IsMongoId()
    offerId: Types.ObjectId;
}