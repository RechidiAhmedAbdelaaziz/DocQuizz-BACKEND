import { IsString } from "class-validator";

export class CreateNoteBody {
    @IsString()
    note: string

}