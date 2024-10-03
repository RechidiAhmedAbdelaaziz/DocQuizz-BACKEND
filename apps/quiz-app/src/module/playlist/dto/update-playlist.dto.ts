import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class UpdatePlaylistBody {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsMongoId()
    addQuestionId?: Types.ObjectId;

    @IsOptional()
    @IsMongoId()
    removeQuestionId?: Types.ObjectId;
}

export class AddQuestionToPlaylistBody {

    @IsArray()
    @IsMongoId({ each: true })
    playlistsToAdd: Types.ObjectId[];

    @IsArray()
    @IsMongoId({ each: true })
    playlistsToRemove: Types.ObjectId[];

}