import { IsName } from "@app/common";
import { IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class UpdateUserBody {
    @IsOptional()
    @IsName()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsMongoId()
    levelId: Types.ObjectId

    @IsOptional()
    @IsMongoId()
    domainId: Types.ObjectId
}

