import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateSubscriptionRequestBody {

    @IsMongoId()
    offerId: Types.ObjectId;

    @IsString()
    image: string;
} 