import { IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class SourceIdParam {
    @IsMongoId()
    sourceId: Types.ObjectId;
}

// * CREATE 
export class CreateSourceBody { 
    @IsString()
    title: string; // "title": "source title"
}


// * UPDATE
export class UpdateSourceBody {
    @IsOptional()
    @IsString()
    title: string;
}

