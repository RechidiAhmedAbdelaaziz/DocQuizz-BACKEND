import { IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class ListLevelsQuery {
    @IsOptional()
    @IsMongoId()
    domainId?: Types.ObjectId;
}

export class ListMajorsQuery {
    @IsOptional()
    @IsMongoId()
    levelId?: Types.ObjectId;
}

export class ListCoursesQuery {

    @IsOptional()
    @IsMongoId()
    majorId: Types.ObjectId;
}