import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateNoteBody {


    @IsOptional()
    @IsString()
    newNote?: string

    @IsOptional()
    @IsBoolean()
    deleteNote?: boolean


}

