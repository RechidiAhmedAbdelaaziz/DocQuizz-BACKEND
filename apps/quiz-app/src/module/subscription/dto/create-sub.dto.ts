import { IsEmail, IsMongoId } from "class-validator";
import { Types } from "mongoose";


export class CreateSubDTO {
    @IsEmail()
    email: string;



    @IsMongoId()
    offerId: Types.ObjectId;
}