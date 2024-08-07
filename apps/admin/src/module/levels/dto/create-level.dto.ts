import { IsString } from "class-validator";

export class CreateLevelBody {
    @IsString()
    name: string
}