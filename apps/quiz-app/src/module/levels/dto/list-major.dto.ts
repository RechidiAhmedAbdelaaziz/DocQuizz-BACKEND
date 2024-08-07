import { IsString } from "class-validator";

export class ListMajorQuery {
    @IsString()
    level: string

}