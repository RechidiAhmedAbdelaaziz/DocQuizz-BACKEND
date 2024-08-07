import { IsEnum, IsString } from "class-validator";

export class AddMajorBody {
    @IsString()
    level: string

    @IsString()
    name: string

}